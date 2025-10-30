import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigModule, ConfigService } from "../config";

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: "AUTH_SERVICE",
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            url: configService.nats.url,
            queue: "auth_queue",
            lazyConnect: true,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: "PRODUCT_SERVICE",
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            url: configService.nats.url,
            queue: "product_queue",
            lazyConnect: true,
          },
        }),
        inject: [ConfigService],
      },
      {
        name: "ORDER_SERVICE",
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            url: configService.nats.url,
            queue: "order_queue",
            lazyConnect: true,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class MicroserviceModule {}
