import axios from "axios";
import config from "../config";

const Promise = require("es6-promise").Promise;

export default function ApiManager(props = {}) {
  const querySpeciesByUser = (
    options = {
      email: ""
    }
  ) => {
    const requestUrl = config.URL.speciesByUser + "/query";
    const whereClause = `${config.FIELD_NAME.speciesByUser.email} = '${
      options.email
    }'`;

    return queryForFeaturesGet(requestUrl, {
      where: whereClause,
      outFields: "*",
      f: "json",
      token: props.oauthManager.getToken()
    });
  };

  const querySpeciesLookupTable = (
    options = {
      speciesCode: []
    }
  ) => {
    const requestUrl = config.URL.speciesLookupTable + "/query";

    const whereClause = options.speciesCode
      .map(d => {
        return `${config.FIELD_NAME.speciesLookup.speciesCode} = '${d}'`;
      })
      .join(" OR ");

    const bodyFormData = new FormData();
    bodyFormData.append("where", whereClause);
    bodyFormData.append("outFields", "*");
    bodyFormData.append("f", "json");
    bodyFormData.append("token", props.oauthManager.getToken());
    return queryForFeaturesPost(
      requestUrl,
      bodyFormData,
      "no features in species lookup table"
    );
  };

  const queryAllFeaturesFromSpeciesLookupTable = () => {
    const requestUrl = config.URL.speciesLookupTable + "/query";

    const bodyFormData = new FormData();
    bodyFormData.append("where", "1=1");
    bodyFormData.append("outFields", "*");
    bodyFormData.append("f", "json");
    bodyFormData.append("token", props.oauthManager.getToken());

    return queryForFeaturesPost(
      requestUrl,
      bodyFormData,
      "no species in species lookup table"
    );
  };

  const queryStatusTable = () => {
    const requestUrl = config.URL.statusTable + "/query";

    return queryForFeaturesGet(
      requestUrl,
      {
        where: "1=1",
        outFields: "*",
        f: "json",
        token: props.oauthManager.getToken()
      },
      "no status found in table"
    );
  };

  const queryHucsBySpecies = speciesKey => {
    // const requestUrl = config.URL.speciesExtent[speciesKey] ? config.URL.speciesExtent[speciesKey] + '/query' : null;

    const requestUrl = config.URL.speciesDistribution + "/query";
    const whereClause = `${
      config.FIELD_NAME.speciesDistribution.speciesCode
    } = '${speciesKey}'`;

    if (requestUrl) {
      return queryForFeaturesGet(
        requestUrl,
        {
          where: whereClause,
          outFields: "*",
          f: "json",
          token: props.oauthManager.getToken()
        },
        "no huc features for selected species"
      );
    } else {
      console.log("species extent table url is not found for", speciesKey);
    }
  };

  const fetchFeedback = (options = {}) => {
    const requestUrl = options.requestUrl; //config.URL.feedbackTable + '/query';
    const whereClause = options.where || "1=1";
    const outFields = options.outFields || "*";
    const returnDistinctValues = options.returnDistinctValues || false;

    return queryForFeaturesGet(
      requestUrl,
      {
        where: whereClause,
        outFields,
        returnDistinctValues,
        f: "json",
        token: props.oauthManager.getToken()
      },
      "no features found from the feedback table",
      true
    );
  };

  const deleteFromFeedbackTable = (requestUrl, objectID) => {
    // const requestUrl = config.URL.feedbackTable + '/deleteFeatures';

    const bodyFormData = new FormData();
    bodyFormData.append("objectIds", objectID);
    bodyFormData.append("rollbackOnFailure", false);
    bodyFormData.append("f", "pjson");
    bodyFormData.append("token", props.oauthManager.getToken());

    return new Promise((resolve, reject) => {
      axios
        .post(requestUrl, bodyFormData)
        .then(function(response) {
          // console.log(response);
          resolve(response);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  };

  const applyEditToFeatureTable = (requestUrl, feature) => {
    // const requestUrl = config.URL.feedbackTable + '/' + operationName;

    const bodyFormData = new FormData();
    bodyFormData.append("features", JSON.stringify(feature));
    bodyFormData.append("rollbackOnFailure", false);
    bodyFormData.append("f", "pjson");
    bodyFormData.append("token", props.oauthManager.getToken());

    return new Promise((resolve, reject) => {
      axios
        .post(requestUrl, bodyFormData)
        .then(function(response) {
          // console.log(response);
          resolve(response);
        })
        .catch(err => {
          console.error(err);
          reject(err);
        });
    });
  };

  const queryPdfTable = (speciesKey = "") => {
    const requestUrl = config.URL.pdfLookup + "/query";
    const whereClause = `${
      config.FIELD_NAME.pdfLookup.speciesCode
    } = '${speciesKey}'`;

    if (requestUrl) {
      return queryForFeaturesGet(
        requestUrl,
        {
          where: whereClause,
          outFields: "*",
          f: "json",
          token: props.oauthManager.getToken()
        },
        "no PDF resouce found for selected species"
      );
    } else {
      console.log("pdf lookup table url is not found for", speciesKey);
    }
  };

  const getDistinctSpeciesCodeFromModelingExtent = () => {
    const requestUrl = config.URL.speciesDistribution + "/query";

    return new Promise(async (resolve, reject) => {
      let feats = await queryForFeaturesGet(
        requestUrl,
        {
          where: "1=1",
          outFields: config.FIELD_NAME.speciesDistribution.speciesCode,
          returnDistinctValues: true,
          f: "json",
          token: props.oauthManager.getToken()
        },
        "failure to query for distinct codes in extent",
        true
      );

      feats = feats.map(d => {
        return d.attributes[config.FIELD_NAME.speciesDistribution.speciesCode];
      });
      resolve(feats);
    });
  };

  const getDataLoadDate = (speciesCode = "") => {
    const fieldNameDataLoadDate =
      config.FIELD_NAME.data_load_date.data_load_date;
    const requestUrl = config.URL.data_load_date + "/query";
    const where = `${
      config.FIELD_NAME.data_load_date.species_code
    } = '${speciesCode}'`;

    return new Promise(async (resolve, reject) => {
      const queryResult = await queryForFeaturesGet(requestUrl, {
        where,
        outFields: fieldNameDataLoadDate,
        f: "json",
        token: props.oauthManager.getToken()
      });

      const dataLoadDate =
        queryResult && queryResult[0]
          ? queryResult[0].attributes[fieldNameDataLoadDate]
          : config.layerParameters.data_load_date.defaultDate;

      resolve(dataLoadDate);
    });
  };

  const queryForFeaturesGet = (
    requestUrl,
    params,
    rejectMessage,
    allowEmpty
  ) => {
    return new Promise((resolve, reject) => {
      let arrOfAllFeatures = [];

      const getFeatures = resultOffset => {
        if (resultOffset) {
          params.resultOffset = resultOffset;
        }

        axios
          .get(requestUrl, {
            params: params
          })
          .then(function(response) {
            if (
              response.data &&
              response.data.features &&
              response.data.features.length
            ) {
              arrOfAllFeatures = [
                ...arrOfAllFeatures,
                ...response.data.features
              ];

              if (response.data.exceededTransferLimit) {
                getFeatures(response.data.features.length);
              } else {
                resolve(arrOfAllFeatures);
              }
            } else {
              if (rejectMessage) {
                if (allowEmpty && response.data && response.data.features) {
                  resolve([]);
                } else {
                  reject(rejectMessage);
                }
              } else {
                resolve([]);
              }
            }
          })
          .catch(err => {
            // console.error(err);
            reject(err);
          });
      };

      getFeatures();
    });
  };

  const queryForFeaturesPost = (
    requestUrl,
    bodyFormData,
    rejectMessage,
    allowEmpty
  ) => {
    return new Promise((resolve, reject) => {
      let arrOfAllFeatures = [];

      const getFeatures = resultOffset => {
        if (resultOffset) {
          bodyFormData.append("resultOffset", resultOffset);
        }

        axios
          .post(requestUrl, bodyFormData)
          .then(function(response) {
            if (
              response.data &&
              response.data.features &&
              response.data.features.length
            ) {
              arrOfAllFeatures = [
                ...arrOfAllFeatures,
                ...response.data.features
              ];

              if (response.data.exceededTransferLimit) {
                getFeatures(response.data.features.length);
              } else {
                resolve(arrOfAllFeatures);
              }
            } else {
              if (rejectMessage) {
                if (allowEmpty && response.data && response.data.features) {
                  resolve([]);
                } else {
                  reject(rejectMessage);
                }
              } else {
                resolve([]);
              }
            }
          })
          .catch(err => {
            // console.error(err);
            reject(err);
          });
      };

      getFeatures();
    });
  };

  return {
    querySpeciesLookupTable,
    queryAllFeaturesFromSpeciesLookupTable,
    queryHucsBySpecies,
    queryStatusTable,
    fetchFeedback,
    deleteFromFeedbackTable,
    applyEditToFeatureTable,
    querySpeciesByUser,
    queryPdfTable,
    getDistinctSpeciesCodeFromModelingExtent,
    getDataLoadDate
  };
}
