import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '../../../backend/routers';
import { createContext } from '../../../backend/routers/context';

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
