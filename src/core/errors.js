export class OmoraError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OmoraError';
  }
}
