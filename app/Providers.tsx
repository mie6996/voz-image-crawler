"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default Providers;
