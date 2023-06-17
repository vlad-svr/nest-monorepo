interface IDomainEvent {
  topic: string;
  data: unknown;
}

export { IDomainEvent };
