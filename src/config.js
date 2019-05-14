"use strict";

module.exports = {
  oauthAppID: "6SfJ02ynq5pvFxPz",
  webMapID: "6c4e0d073ff94d4cb979e29128a43eb7",

  FIELD_NAME: {
    // hucLayerHucID: "HUC8",
    // hucLayerHucName: "HUC8",
    hucLayerHucID: "HUC_8",
    hucLayerHucName: "HUC_8",
    statusType: "StatusType",
    speciesLookup: {
      speciesCode: "ELEMENT_GL",
      speciesName: "SCIENTIFIC",
      taxa: "TAXONOMIC_",
      boundaryLayerLink: "BoundaryLayerLink",
      pdfLink: "PdfLink"
    },
    speciesDistribution: {
      speciesCode: "EGTID",
      hucID: "LOCATION"
    },
    feedbackTable: {
      hucID: "HUCID",
      userID: "UserID",
      species: "Species",
      comment: "Comment",
      status: "StatusType",
      retirementDate: "RetirementDate",
      data_load_date: "DataLoadDate"
    },
    overallFeedback: {
      userID: "UserID",
      species: "Species",
      comment: "Comment",
      rating: "Rating",
      retirementDate: "RetirementDate",
      data_load_date: "DataLoadDate"
    },
    speciesByUser: {
      speciesCode: "cutecode",
      email: "Reviewer_email"
    },
    // pdfLookup: {
    //   speciesCode: "cutecode",
    //   url: "url"
    // },
    data_load_date: {
      species_code: "cutecode",
      data_load_date: "DataLoadDate"
    }
  },

  DOM_ID: {
    mainControl: "mainControlDiv",
    mapViewContainer: "viewDiv",
    speciesSelector: "selectorsDiv",
    feedbackControl: "feedbackControlDiv",
    overallFeedbackControl: "overallFeedbackDiv",
    legend: "legendDiv",
    listViewOverallFeedback: "listViewForOverallFeedbackDiv",
    listViewDeatiledFeedback: "listViewForDetailedFeedbackDiv",
    listViewForFeedbacksByHuc: "listViewForFeedbacksByHucDiv",
    searchWidgetDiv: "searchWidgetDiv",
    layerListDiv: "layerListDiv"
  },

  URL: {
    speciesLookupTable:
      "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/NABA_Species_Master_List/FeatureServer/0",

    speciesDistribution:
      "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/NABA_Species_Modeling_Extent/FeatureServer/0",

    speciesByUser:
      "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/NABA_Species_By_Reviewer/FeatureServer/0",

    statusTable:
      "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/NABA_Status_Code_Lookup/FeatureServer/0",
    feedbackTable:
      "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/NABA_Detailed_Feedback/FeatureServer/0",
    overallFeedback:
      "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/NABA_Overall_Feedback/FeatureServer/0",

    // PredictedHabitat: {
    //   // "137976": "https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Isotria_medeloides_Boundary/FeatureServer/0",
    //   // "941975": "https://services.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Lithobates_kauffeldi_Boundary/FeatureServer/0",
    //   line:
    //     "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/Predicted_Habitat_Line/FeatureServer/0",
    //   polygon:
    //     "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/Predicted_Habitat_Polygon/FeatureServer/0"
    // },
    // pdfLookup:
    //   "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/PDF_Lookup/FeatureServer/0",
    WatershedBoundaryDataset_HUC8:
      "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/NABA_HUC8/FeatureServer/0",
    //"https://hydro.nationalmap.gov/arcgis/rest/services/wbd/MapServer/4",
    data_load_date:
      "https://services.arcgis.com/EVsTT4nNRCwmHNyb/arcgis/rest/services/NABA_Data_Load_Date/FeatureServer/0"
  },

  layerParameters: {
    WatershedBoundaryDataset_HUC8: {
      minScale: 2311165,
      maxScale: 0
    },
    data_load_date: {
      defaultDate: "5/14/2019  7:00:00 AM"
    }
  },

  reference_layers: {
    usa_protected_areas: {
      itemId: "dd6077b7b71c4492aceab1ae0146ad1c",
      title: "USA Protected Areas"
    },
    USA_NLCD_Land_Cover_2011: {
      itemId: "aa71e15357a14dbb93a50ef3a8e06f70",
      title: "USA NLCD Land Cover"
    },
    USA_Forest_Type: {
      itemId: "593d022dbeb24c3abbf6c509fd592dd2",
      title: "USA Forest Type"
    },
    USA_Wetlands: {
      itemId: "0cb75b1f54854ad188302cd8b260c98f",
      title: "USA Wetlands"
    },
    HUC6: {
      itemId: "651da243132d4ed78dadbf2e5a6c8e5a",
      title: "Watersheds (HUC6)"
    }
  },

  COLOR: {
    hucBorder: [255, 255, 255, 0.3],
    hucBorderIsModeled: [255, 255, 255, 0.5],
    hucBorderCommentWithoutAction: [239, 35, 60, 1],
    hucFill: [217, 217, 217, 0.4],
    status0: [200, 200, 200, 0.5],
    status1: [166, 219, 160, 0.5],
    status2: [194, 165, 207, 0.5],
    actualModeledExtent: "#ffd400"
  }
};
