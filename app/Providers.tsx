"use client";

import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import React, { useState } from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
          },
        },
      })
  );

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
  });

  return (
    <>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <SessionProvider>{children}</SessionProvider>;
        {process.env.NODE_ENV !== "production" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </PersistQueryClientProvider>
    </>
  );
}

export default Providers;
