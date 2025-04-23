"use client"
import { usePreventBackNavigation } from "@/hooks/use-prevent-back-navigation";

export function BackNavigationGuard() {
    usePreventBackNavigation();
    return null
}