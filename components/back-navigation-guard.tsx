"use client"
import { usePreventBackNavigation } from "@/app/hooks/use-prevent-back-navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function BackNavigationGuard() {
    usePreventBackNavigation();

    return null
}