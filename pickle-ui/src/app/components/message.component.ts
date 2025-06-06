import moment from 'moment';

export class MessageComponent {
  message: string | null = null;
  error: string | null = null;

  setMessage(msg: string) {
    this.error = null;
    this.message = msg;
  }
  setError(err: string) {
    this.message = null;
    this.error = err;
  }
  fromNow(date: any) {
    return moment(date).fromNow();
  }
}
