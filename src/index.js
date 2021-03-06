import "./style/index.scss";

import "@babel/polyfill";

import config from "./config";
import Controller from "./core/Controller";
import View from "./core/View";
import MapControl from "./core/MapControl";
import OAuthManager from "./core/OauthManager";
import CsvLoader from "./core/CsvLoader";

import PolyfillForIE from "./utils/PolyfillForIE";

(async function initOAuthManager() {
  const oauthManager = new OAuthManager(config.oauthAppID);
  await oauthManager.init();

  //document.querySelector(".js-accept-terms").addEventListener("click", evt => {
  // console.log('agress');
  initApp(oauthManager);
  //});
})();

const initApp = async oauthManager => {
  if (!oauthManager) {
    console.error("oauth manager is required to init the app...");
    return;
  }

  const view = new View();

  const mapControl = new MapControl({
    webMapID: config.webMapID,
    mapViewContainerID: config.DOM_ID.mapViewContainer,
    onScaleChange: (newScale = 0) => {
      // console.log('newScale', newScale);
      view.legend.render(newScale);
    }
  });

  const controller = new Controller({
    oauthManager,

    speciesDataOnReady: data => {
      // console.log('speciesDataOnReady', data);
      view.speciesSelector.render({ data });
    },
    legendDataOnReady: data => {
      view.legend.init({ data });
    },
    feedbackManagerOnOpen: data => {
      view.toggleControlPanel({
        target: view.feedbackControlPanel,
        isVisible: true,
        data
      });
    },
    feedbackManagerOnClose: () => {
      view.toggleControlPanel({
        target: view.feedbackControlPanel,
        isVisible: false
      });
    },
    speciesOnSelect: () => {
      view.enableOpenOverallFeedbackBtnBtn();
    },
    onDeatiledFeedbackSubmit: data => {
      // console.log('onDeatiledFeedbackSubmit', data);
      const species = data.species;
      view.speciesSelector.setSpeciesSelectorOptionAsReviewed(
        species,
        "detailed"
      );
    },
    onOverallFeedbackSubmit: data => {
      // console.log('onOverallFeedbackSubmit', data);
      const species =
        data.attributes[config.FIELD_NAME.overallFeedback.species];
      view.speciesSelector.setSpeciesSelectorOptionAsReviewed(
        species,
        "overall"
      );
    },

    onReviewMode: () => {
      view.switchToReviewModeView();
      view.initViewComponentsForReviewMode();
    },
    overallFeedbackForReviewModeOnReady: (data = null) => {
      view.openListView(view.listViewForOverallFeedback, data);
    },
    feedbackByUsersForReviewModeOnReady: (data = null) => {
      view.openListView(view.listViewForDetailedFeedback, data);
    },
    feedbackByHucsForReviewModeOnReady: (data = null) => {
      view.openListView(view.listViewForFeedbacksByHuc, data);
    },
    hucFeatureOnSelectForReviewMode: feature => {
      if (view.listViewForDetailedFeedback.isVisible()) {
        view.listViewForDetailedFeedback.setActiveRow(
          feature.attributes[config.FIELD_NAME.hucLayerHucID]
        );
      } else {
        controller.getFeedbacksByHucForReviewMode(feature);
      }
    },

    highligtHucsOnMap: hucIds => {
      // console.log('highligtHucsOnMap', data);
      mapControl.highlightHucs(hucIds);
    },
    // addActualBoundaryLayerToMap:(url='')=>{
    //     // console.log('addActualBoundaryLayerToMap', url);
    //     // mapControl.addActualModelBoundaryLayer(url);
    // },
    showToPredictedHabitatOnMap: (speciesCode = "") => {
      //mapControl.showPredictedHabitatLayers(speciesCode);
    },
    zoomToHucsOnMap: (hucIds = []) => {
      mapControl.zoomToHucs(hucIds);
    },
    clearMapGraphics: (targetLayer = "") => {
      // console.log('clearMapGraphics', targetLayer);
      mapControl.clearMapGraphics(targetLayer);
    },
    showHucFeatureOnMap: (hucID = "", status) => {
      // console.log('showHucFeatureOnMap', hucID);
      mapControl.showHucFeatureByStatus(hucID, status);
    },
    addPreviewHucByID: hucID => {
      mapControl.addPreviewHucByID(hucID);
    },

    pdfUrlOnChange: (url = "") => {
      view.toggleDownloadAsPdfBtn(url);
    }
  });

  view.speciesSelector.init({
    onChange: val => {
      // console.log(val);
      mapControl.clearAllGraphics();
      controller.setSelectedSpecies(val);
    }
  });

  view.feedbackControlPanel.init({
    containerID: config.DOM_ID.feedbackControl,
    onCloseHandler: () => {
      controller.resetSelectedHucFeature();
    },
    commentOnChange: val => {
      // console.log(val);
      controller.feedbackManager.feedbackDataModel.setComment(val);
    },
    additionalFieldInputOnChange: (field, value) => {
      controller.feedbackManager.feedbackDataModel.setAdditionalField(
        field,
        value
      );
    },
    onSubmitHandler: status => {
      // console.log('submit btn on click, new status >', status);
      if (status) {
        controller.feedbackManager.feedbackDataModel.setStatus(status);
      }
      controller.feedbackManager.submit();
    },
    onRemoveHandler: () => {
      controller.feedbackManager.remove();
    }
  });

  view.overallFeedbackControlPanel.init({
    containerID: config.DOM_ID.overallFeedbackControl,
    onCloseHandler: () => {
      // view.toggleOverallFeeback(false);

      view.toggleControlPanel({
        target: view.overallFeedbackControlPanel,
        isVisible: false
      });
    },
    onSubmitHandler: data => {
      // console.log('submit overall feedback', data);
      // view.toggleOverallFeeback(false);

      view.toggleControlPanel({
        target: view.overallFeedbackControlPanel,
        isVisible: false
      });

      controller.postOverallFeedback(data);
    }
  });

  view.init({
    // downloadPdfBtnOnClick: ()=>{
    //     controller.downloadPdf();
    // },
    openOverallBtnOnclick: () => {
      // const data = controller.getOverallFeedback();
      // view.toggleOverallFeeback(true, data);
      view.toggleControlPanel({
        target: view.overallFeedbackControlPanel,
        isVisible: true,
        data: controller.getOverallFeedback()
      });
    },
    layerOpacitySliderOnUpdate: val => {
      // console.log(val);
      mapControl.setLayersOpacity(val);
    },
    listViewForOverallFeedbackOnClick: userID => {
      controller.getFeedbacksByUserForReviewMode(userID);
    },
    listViewForDetailedFeedbackOnClose: () => {
      controller.renderListOfHucsWithFeedbacks();
    },
    listViewForDetailedFeedbackOnClick: hucID => {
      mapControl.addPreviewHucByID(hucID);
    },
    listViewForFeedbacksByHucOnClose: () => {
      controller.resetSelectedHucFeature();
    },
    signOutBtnOnClick: () => {
      controller.signOut();
    }
  });

  controller.init({
    // token: credential.token
  });

  mapControl.init({
    hucFeatureOnSelectHandler: hucFeature => {
      // console.log('selected hucFeature', hucFeature);
      controller.setSelectedHucFeature(hucFeature);
    }
  });

  const csvLoader = new CsvLoader({
    targetDomElementId: config.DOM_ID.mapViewContainer,
    onLoadHandler: csvData => {
      if (csvData.features && csvData.features.length) {
        // console.log('csv data deatures', csvData.features);
        mapControl.addCsvLayer(csvData.features);
      }
    }
  });
  csvLoader.init();

  // window.appDebugger = {
  //     signOut: oauthManager.signOut
  // };
};
