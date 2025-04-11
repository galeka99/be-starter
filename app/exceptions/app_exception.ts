export default class AppException extends Error {
  private _status: number
  private _message: string
  private _data: any

  constructor(status = 500, message = 'An error occured on the server', data = null) {
    super(message)

    this._status = status
    this._message = message
    this._data = data
  }

  public get status() {
    return this._status
  }

  public get data() {
    return this._data
  }

  public get message() {
    return this._message
  }
}
