import { BookOpen, Home, MessageCircleQuestion, Settings } from "lucide-react";
import type { BottomNavItem } from "@/components/ui";

export const NAV_ITEMS: BottomNavItem[] = [
  { id: "home", label: "홈", icon: <Home size={14} /> },
  { id: "qna", label: "질문&답변", icon: <MessageCircleQuestion size={14} /> },
  { id: "diary", label: "다이어리", icon: <BookOpen size={14} /> },
  { id: "settings", label: "설정", icon: <Settings size={14} /> },
];

export const NAV_ROUTES: Record<string, string> = {
  home: "/",
  qna: "/questions",
  diary: "/diary",
  settings: "/settings",
};
