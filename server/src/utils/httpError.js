export class HttpError extends Error {
  constructor(status, code, message, fields) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

export function validationError(fields, message = 'Dữ liệu gửi lên chưa hợp lệ.') {
  return new HttpError(400, 'VALIDATION_ERROR', message, fields)
}
