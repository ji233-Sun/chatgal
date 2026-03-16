/**
 * ArcadeUI - 像素风 React 组件库类型声明
 * 包 v1.0.1 未包含 .d.ts，手动声明
 */
declare module "arcadeui" {
  import { FC, ReactNode } from "react";

  // ===== Button =====
  export interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "danger" | "success";
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }
  export const Button: FC<ButtonProps>;

  // ===== Card =====
  export interface CardProps {
    children: ReactNode;
    variant?: "default" | "outlined" | "elevated";
    className?: string;
    title?: string;
    footer?: ReactNode;
  }
  export const Card: FC<CardProps>;

  // ===== Avatar =====
  export interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: "sm" | "md" | "lg" | "xl";
    shape?: "square" | "circle";
    className?: string;
  }
  export const Avatar: FC<AvatarProps>;

  // ===== Badge =====
  export interface BadgeProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
    size?: "sm" | "md" | "lg";
    className?: string;
  }
  export const Badge: FC<BadgeProps>;

  // ===== ChatBubble =====
  export interface ChatBubbleProps {
    message: string;
    isSent?: boolean;
    timestamp?: string;
    className?: string;
  }
  export const ChatBubble: FC<ChatBubbleProps>;

  // ===== Modal =====
  export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg";
    showCloseButton?: boolean;
    className?: string;
  }
  export const Modal: FC<ModalProps>;

  // ===== Alert =====
  export interface AlertProps {
    children: ReactNode;
    variant?: "info" | "success" | "warning" | "error";
    title?: string;
    size?: "sm" | "md" | "lg";
    onClose?: () => void;
    className?: string;
  }
  export const Alert: FC<AlertProps>;

  // ===== Input =====
  export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    error?: string;
    variant?: "default" | "success" | "error";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    className?: string;
  }
  export const Input: FC<InputProps>;

  // ===== Select =====
  export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
    label?: string;
    error?: string;
    variant?: "default" | "success" | "error";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    options: Array<{ value: string; label: string }>;
    className?: string;
  }
  export const Select: FC<SelectProps>;

  // ===== Accordion =====
  export interface AccordionItemProps {
    title: ReactNode;
    children: ReactNode;
    isOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
    className?: string;
  }
  export const AccordionItem: FC<AccordionItemProps>;

  export interface AccordionProps {
    children: ReactNode;
    allowMultiple?: boolean;
    defaultIndex?: number | number[];
    className?: string;
  }
  export const Accordion: FC<AccordionProps>;

  // ===== Breadcrumbs =====
  export interface BreadcrumbItem {
    label: string;
    href?: string;
  }
  export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    separator?: ReactNode;
    className?: string;
  }
  export const Breadcrumbs: FC<BreadcrumbsProps>;

  // ===== Carousel =====
  export interface CarouselProps {
    items: ReactNode[];
    autoPlayInterval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    className?: string;
  }
  export const Carousel: FC<CarouselProps>;

  // ===== Calendar =====
  export interface CalendarProps {
    selectedDate?: Date;
    onDateSelect?: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
    className?: string;
  }
  export const Calendar: FC<CalendarProps>;

  // ===== Table =====
  export interface TableColumn<T> {
    key: keyof T;
    title: string;
    render?: (value: T[keyof T], record: T) => ReactNode;
    sortable?: boolean;
  }
  export interface TableProps<T extends Record<string, unknown>> {
    data: T[];
    columns: TableColumn<T>[];
    className?: string;
    striped?: boolean;
    hoverable?: boolean;
    currentPage?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  }
  export const Table: <T extends Record<string, unknown>>(props: TableProps<T>) => JSX.Element;
}
