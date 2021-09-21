/* eslint-disable @typescript-eslint/naming-convention */
import { Component } from '@angular/core';

import { Plugins } from '@capacitor/core';
import 'scandit-capacitor-datacapture-core';
import 'scandit-capacitor-datacapture-barcode';

const { ScanditCaptureCorePlugin } = Plugins;

let Scandit = null;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() {}

  async ionViewDidEnter() {
    try {
      // Initialize the plugins.
      Scandit = await ScanditCaptureCorePlugin.initializePlugins();
      alert(Scandit);

      // Calculate the width of a quadrilateral (barcode location) based on it's corners.
      // eslint-disable-next-line space-before-function-paren
      Scandit.Quadrilateral.prototype.width = function () {
        return Math.max(
          this.topRight.x - this.topLeft.x,
          this.bottomRight.x - this.bottomLeft.x
        );
      };

      const context = Scandit.DataCaptureContext.forLicenseKey(
        // eslint-disable-next-line max-len
        'AWqwqAD8IDJ+CX7jIg3p2Hs+u0OvKR92yFsnPyJG/RwNZY6FvVFNBuZw8eMtXMjmbE8bQ8dPW3ztcBHdonzd0L53vhK3VwBkdSutPuNjC7BUf8lTsm5jnZphNORSQvu9hiP2Iy40DrTgCUByul39CjSGQGDxZTSA494R0ZSy40XGp26ThHuNu9sTgnlFdA/wj1Y9yJIlqzLlE5e87Io3QZ3OWrxzXkDQVrS96lLMIeJFYpPHhxKv4gepsFItBIO1p6j+ggjU0fT1zGs60KdgciMJsnWzzBXxfZVfC0YT1zpnt+oUL3G5E+Autg5eayVsMqDx3Xrh64l3DQppTWidYGu3wpddGaz5JWFnryWDOuu1TxrDkVIZGMeZmUrQ1Xoo+qW7owTjbA0RJ4Vbfl+dtoJkFy3SfNe8gBPtcHvvS7uVoL+mJfxF1jgynXaaI/m7P+2NcDmMnxINTRGb1C78CVGve1APsi+i9Xc9yVCPDwOIjsNCfpNgYdRTImTcGx+lnGTvVcYfWBO+rqkZuhqQavrA08Zqwzs7zCag5h86uQjmSwbnhA0bmK1KLu++zpwYpG/W71mYs9+0bhzgO65g+x9ICdzHR9QsdTmN0pw0XULzxy6JWQJ/NakhdVwV7bgmBAaULvRq0avgM4NeEMxsL7qLbILVtWB7UsLs7aeYcxiAH24p1eh/z0ILilMm2l3sXy3iFpgBvSvEDFAooyU9UFfPzqOVRCHCT5Tpmh5dw7zMbfm0Hj1kaKMIy3HEha+WfgCBb3iGkQSEfZMcGO39gHbDhd7ZQfj6r/ocjrycgFrZ8f6n5ZbE0GgsusS3'
      );

      const settings = new Scandit.BarcodeTrackingSettings();
      settings.enableSymbology(Scandit.Symbology.QR, true);

      const barcodeTracking = Scandit.BarcodeTracking.forContext(
        context,
        settings
      );

      const cameraSettings = Scandit.BarcodeTracking.recommendedCameraSettings;

      // Depending on the use case further camera settings adjustments can be made here.

      const camera = Scandit.Camera.default;
      if (camera !== null) {
        camera.applySettings(cameraSettings);
      }

      context.setFrameSource(camera);

      camera.switchToDesiredState(Scandit.FrameSourceState.On);

      const view = Scandit.DataCaptureView.forContext(context);
      view.connectToElement(document.getElementById('data-capture-view'));

      const overlay =
        Scandit.BarcodeTrackingBasicOverlay.withBarcodeTrackingForView(
          barcodeTracking,
          view
        );

      overlay.listener = {
        brushForTrackedBarcode: (o, trackedBarcode) => {
          // Return a custom Brush based on the tracked barcode.
          alert(o);
          alert(trackedBarcode);
        },
      };
    } catch (error) {
      alert(error);
    }
  }
}
