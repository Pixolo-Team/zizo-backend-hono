import { playersController } from '@/controllers/players.controller';
import { getPlayersRoute } from '@/contracts/players.contract';
import { openapiApp } from '@/routes/openapi.routes';

openapiApp.openapi(getPlayersRoute, (c) => playersController.getPlayers(c));
