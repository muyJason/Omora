export class OmoraError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OmoraError';
  }
}
