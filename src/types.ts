import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface CodeSnippetProps {
  language: string;
  code: string;
  title?: string;
}