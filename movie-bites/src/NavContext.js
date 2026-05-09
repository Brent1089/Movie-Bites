import { createContext } from 'react';
import navigation from './models/navigation';

/**
 * Supplies the static navigation items rendered by the main nav bar.
 */
export const NavigationContext = createContext(navigation);
