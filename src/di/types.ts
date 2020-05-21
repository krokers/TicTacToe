const TYPES = {
    GameRepository: Symbol.for("GameRepository"),
    HistoryRepository: Symbol.for("HistoryRepository"),
    GameService: Symbol.for("GameService"),
    GameOverService: Symbol.for("GameOverService"),
    IGraphqlResolver: Symbol.for("IGraphqlResolver"),
    Logger: Symbol.for("ILogger"),
    GameResolvers: Symbol.for('GameResolvers'),
    HistoryResolvers: Symbol.for('HistoryResolvers'),
    InputValidators: Symbol.for('InputValidators'),
    SubscriptionsService: Symbol.for('SubscriptionsService'),
    ServerConfig: Symbol.for('ServerConfig'),


};

export { TYPES };