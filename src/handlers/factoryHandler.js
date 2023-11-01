const catchAsync = require('../utils/commonUtils');
const AppError = require('../utils/AppError');
const APIFeatures = require('../utils/apiFeatures');
const {
  COMMON_MODEL_ERRORS,
  HTTP_STATUS_CODES,
  HTTP_STATUS,
} = require('../utils/constants');

exports.deleteOne = (Model) => {
  catchAsync(async (request, response, next) => {
    const document = await Model.findByIdAndDelete(request.params.id);
    if (!document) {
      return next(
        new AppError(
          COMMON_MODEL_ERRORS.NO_DOCUMENT_FOUND,
          HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND,
        ),
      );
    }
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.NO_CONTENT).json({
      status: HTTP_STATUS.SUCCESS,
      data: null,
    });
  });
};

exports.updateOne = (Model) => {
  catchAsync(async (request, response, next) => {
    const document = await Model.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!document) {
      return next(
        new AppError(
          COMMON_MODEL_ERRORS.NO_DOCUMENT_FOUND,
          HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND,
        ),
      );
    }
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
      status: HTTP_STATUS.SUCCESS,
      data: document,
    });
  });
};

exports.createOne = (Model) => {
  catchAsync(async (request, response, next) => {
    const document = await Model.create(request.body);
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.CREATED).json({
      status: HTTP_STATUS.SUCCESS,
      data: {
        data: document,
      },
    });
  });
};

exports.getOne = (Model, options) => {
  catchAsync(async (request, response, next) => {
    let query = Model.findById(request.params.id);
    if (options) query = query.populate(options);
    const returnedDocument = await query;
    if (!returnedDocument) {
      return next(
        new AppError(
          COMMON_MODEL_ERRORS.NO_DOCUMENT_FOUND,
          HTTP_STATUS_CODES.CLIENT_ERROR_RESPONSE.NOT_FOUND,
        ),
      );
    }
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
      status: HTTP_STATUS.SUCCESS,
      data: returnedDocument,
    });
  });
};

exports.getAll = (Model) => {
  catchAsync(async (request, response, next) => {
    let filter = {};
    if (request.params.tourId) {
      filter = { tour: request.params.tourId };
    }
    const features = new APIFeatures(Model.find(filter), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const returnedDocuments = await features.query;
    response.status(HTTP_STATUS_CODES.SUCCESSFUL_RESPONSE.OK).json({
      status: 'success',
      results: returnedDocuments.length,
      data: {
        data: returnedDocuments,
      },
    });
  });
};
