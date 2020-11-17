class KeyValuePair {
  private key: string;

  private value: string | number | boolean;

  constructor(key: string, value: string | number | boolean) {
    this.key = key;
    this.value = value;
  }

  public getKey(): string {
    return this.key;
  }

  public getValue(): string | number | boolean {
    return this.value;
  }
}

export { KeyValuePair };
