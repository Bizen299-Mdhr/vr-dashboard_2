require("module-alias/register");
const awilix = require("awilix");

const { Lifetime } = awilix;

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});
const containerSetup = async () => {
    container.loadModules(
        [
            "./src/controllers/**/*.js"
        ],
        {
            resolverOptions: {
                register: awilix.asClass,
                lifetime: Lifetime.transient
            },
            formatName: "camelCase"
        }
    );

    container.loadModules(
        [
            "./src/services/**/*.js",
            "./src/transformers/**/*.js"
        ],
        {
            resolverOptions: {
                register: awilix.asClass,
                lifetime: Lifetime.SINGLETON
            },
            formatName: "camelCase"
        }
    );
    container.register({
        bindAll: awilix.asFunction(() => (instance, prototype) => {
            // Get methods
            const proto = Object.getPrototypeOf(instance);
            const methods = [
                ...Object.getOwnPropertyNames(prototype),
                ...Object.getOwnPropertyNames(proto)
            ];

            // Bind methods
            // eslint-disable-next-line no-restricted-syntax
            for (const method of methods) {
                if (typeof instance[method] === "function") {
                    instance[method] = instance[method].bind(instance);
                }
            }
        }),
        container: awilix.asFunction(() => container)
    });
};

module.exports = {
    container,
    containerSetup
};
