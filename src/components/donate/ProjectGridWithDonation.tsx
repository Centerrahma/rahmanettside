'use client';

import { Fragment, useRef } from 'react';
import type { DonationProject } from '@/types/donation';
import ProjectCard from '@/components/donate/ProjectCard';
import CompactProjectTile from '@/components/donate/CompactProjectTile';
import CompactVippsTile from '@/components/donate/CompactVippsTile';
import DonationWidget from '@/components/donate/DonationWidget';

interface ProjectGridWithDonationProps {
  projects: DonationProject[];
  translations: {
    projectTitles: Record<string, string>;
    raisedLabel: string;
    targetLabel: string;
    fundedLabel: string;
    donorsLabel: string;
    vsLastMonthLabel: string;
    raisedThisMonthLabel: string;
    makeADonation: string;
    donationSubtitle: string;
    oneTimeLabel: string;
    monthlyLabel: string;
    customAmountLabel: string;
    confirmLabel: string;
    securityNote: string;
    processingLabel: string;
  };
}

export default function ProjectGridWithDonation({
  projects,
  translations: t,
}: ProjectGridWithDonationProps) {
  const donationRef = useRef<HTMLDivElement>(null);

  const scrollToDonation = () => {
    donationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const projectsWithoutMihrab = projects.filter(p => p.id !== 'mihrab');
  const mihrab = projects.find(p => p.id === 'mihrab');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 auto-rows-min">
      {/* Left column: project cards */}
      <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-5">

        {/* ===== MOBILE: Compact 2-col grid ===== */}
        <div className="grid grid-cols-2 gap-2.5 md:hidden">
          {projectsWithoutMihrab.map((project, index) => (
            <Fragment key={project.id}>
              {/* Insert Vipps tile after first project */}
              {index === 1 && (
                <CompactVippsTile onClick={scrollToDonation} />
              )}
              <CompactProjectTile
                project={project}
                title={t.projectTitles[project.id] ?? project.titleKey}
                targetLabel={t.targetLabel}
                onClick={scrollToDonation}
              />
            </Fragment>
          ))}
          {mihrab && (
            <CompactProjectTile
              project={mihrab}
              title={t.projectTitles[mihrab.id] ?? mihrab.titleKey}
              targetLabel={t.targetLabel}
              onClick={scrollToDonation}
            />
          )}
        </div>

        {/* ===== DESKTOP: Existing bento grid ===== */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-5">
          {projectsWithoutMihrab.map((project, index) => (
            <Fragment key={project.id}>
              {index === 1 && (
                <div className="glass-panel bento-card p-4 relative overflow-hidden flex flex-col justify-center items-center h-full group hover:bg-[rgba(var(--color-primary-rgb),0.05)] transition-colors duration-300 text-center">
                  <div className="flex flex-col items-center justify-center flex-1">
                    <h3 className="text-2xl font-bold text-[var(--color-text)] mb-1.5">Vipps</h3>
                    <p className="text-4xl font-bold text-primary tracking-wider">77811</p>
                  </div>
                  <p className="text-xs font-medium text-[var(--color-text-muted)] mt-3">
                    Velg kategori du ønsker å donere til
                  </p>
                </div>
              )}
              <ProjectCard
                project={project}
                title={t.projectTitles[project.id] ?? project.titleKey}
                raisedLabel={t.raisedLabel}
                targetLabel={t.targetLabel}
                fundedLabel={t.fundedLabel}
                donorsLabel={t.donorsLabel}
                vsLastMonthLabel={t.vsLastMonthLabel}
                raisedThisMonthLabel={t.raisedThisMonthLabel}
              />
            </Fragment>
          ))}
          {mihrab && (
            <ProjectCard
              project={mihrab}
              title={t.projectTitles[mihrab.id] ?? mihrab.titleKey}
              raisedLabel={t.raisedLabel}
              targetLabel={t.targetLabel}
              fundedLabel={t.fundedLabel}
              donorsLabel={t.donorsLabel}
              vsLastMonthLabel={t.vsLastMonthLabel}
              raisedThisMonthLabel={t.raisedThisMonthLabel}
            />
          )}
        </div>
      </div>

      {/* Right column: Donation widget */}
      <div className="md:col-span-5 lg:col-span-4">
        <div ref={donationRef} className="sticky top-24 scroll-mt-28">
          <DonationWidget
            title={t.makeADonation}
            subtitle={t.donationSubtitle}
            oneTimeLabel={t.oneTimeLabel}
            monthlyLabel={t.monthlyLabel}
            customAmountLabel={t.customAmountLabel}
            confirmLabel={t.confirmLabel}
            securityNote={t.securityNote}
            processingLabel={t.processingLabel}
          />
        </div>
      </div>
    </div>
  );
}
