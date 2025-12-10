import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  Chip,
  Listbox,
  ListboxItem,
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
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-auto box-border flex h-full w-full max-w-7xl flex-col gap-y-4 p-4">
      {/* Header */}
      <header>
        <Card className="bg-primary/80">
          <CardHeader className="flex w-full flex-row items-center justify-between text-white">
            <div className="size-6">
              <Logo />
            </div>
            <p className="text-lg">{data.title}</p>
            <p className="text-sm">{currentTime}</p>
          </CardHeader>
        </Card>
      </header>

      {/* Main Content */}
      <main>
        <Listbox aria-label="Listbox menu with descriptions" variant="flat">
          {data.modules.map((module, index) => (
            <ListboxItem
              key={index}
              className="border-default-100 border"
              description={
                <span className="text-default-400 text-sm font-normal">
                  {module.link}
                </span>
              }
              onPress={() => {
                window.open(module.link, '_self');
              }}
              startContent={<span>{index + 1}、</span>}
              endContent={
                <Chip
                  color={module.flagText === 'serve' ? 'primary' : 'secondary'}
                  size="sm"
                  classNames={{
                    content: 'text-sm',
                  }}
                >
                  {module.flagText}
                </Chip>
              }
            >
              <span className="text-sm font-normal">{module.name}</span>
            </ListboxItem>
          ))}
        </Listbox>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm text-gray-400">
          © Copyright 2025 hyperse | All rights reserved.
        </p>
      </footer>
    </div>
  );
};
