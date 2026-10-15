import { useEffect, useState } from 'react';
import {
  Card,
  Chip,
  Description,
  Label,
  ListBox,
  Spinner,
} from '@heroui/react';
import { Logo } from './Logo';

export interface MainTemplateModuleItemData {
  name: string;
  link: string;
  flagText: string;
  isServed: 1 | 0;
}

export interface MainTemplateData {
  title: string;
  modules: MainTemplateModuleItemData[];
}

declare global {
  interface Window {
    HPS_MAIN_DASHBOARD_DATA?: MainTemplateData;
  }
}

export const Dashboard = () => {
  const [data, setData] = useState<MainTemplateData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // 获取数据
    const dashboardData = window?.HPS_MAIN_DASHBOARD_DATA;
    if (dashboardData) {
      setData(dashboardData);
    }

    // 更新时间
    const updateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${year}/${month}/${day} ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-y-4">
          <Spinner />
          <p className="text-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-auto box-border flex h-full w-full max-w-7xl flex-col gap-y-4 p-4">
      {/* Header */}
      <header>
        <Card className="bg-accent/80">
          <Card.Header className="flex w-full flex-row items-center justify-between text-white">
            <div className="size-6">
              <Logo />
            </div>
            <p className="text-lg">{data.title}</p>
            <p className="text-sm">{currentTime}</p>
          </Card.Header>
        </Card>
      </header>

      {/* Main Content */}
      <main>
        <ListBox
          aria-label="Listbox menu with descriptions"
          selectionMode="none"
        >
          {data.modules.map((module, index) => (
            <ListBox.Item
              key={index}
              className="border-separator border"
              id={String(index)}
              onAction={() => {
                window.open(module.link, '_self');
              }}
              textValue={module.name}
            >
              <span>{index + 1}、</span>
              <div className="flex flex-col">
                <Label>{module.name}</Label>
                <Description className="text-muted font-normal">
                  {module.link}
                </Description>
              </div>
              <Chip
                className="text-sm"
                color={module.flagText === 'serve' ? 'accent' : 'default'}
                size="sm"
              >
                <Chip.Label>{module.flagText}</Chip.Label>
              </Chip>
            </ListBox.Item>
          ))}
        </ListBox>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-muted text-sm">
          © Copyright 2025 hyperse | All rights reserved.
        </p>
      </footer>
    </div>
  );
};
