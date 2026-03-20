'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { localizeNum } from '@/lib/utils';

const PROJECTS_PER_ROW = 9;
const TOTAL_ROWS = 10;

interface GridItem {
  name: string;
  year: number | string;
  img: string;
}

interface ExpandingGridProps {
  items?: GridItem[];
  locale?: string;
}

export default function ExpandingGrid({ items, locale = 'en' }: ExpandingGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement[]>([]);
  const rowStartWidth = useRef(125);
  const rowEndWidth = useRef(500);

  const allItems = items && items.length > 0 ? items : [];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rows = rowsRef.current.filter(Boolean);
    if (rows.length === 0) return;

    const isMobile = window.innerWidth < 1000;
    rowStartWidth.current = isMobile ? 250 : 125;
    rowEndWidth.current = isMobile ? 750 : 500;

    // Calculate expanded section height
    const firstRow = rows[0];
    firstRow.style.width = `${rowEndWidth.current}%`;
    const expandedRowHeight = firstRow.offsetHeight;
    firstRow.style.width = '';

    const sectionGap = parseFloat(getComputedStyle(section).gap) || 0;
    const sectionPadding = parseFloat(getComputedStyle(section).paddingTop) || 0;

    const expandedSectionHeight =
      expandedRowHeight * rows.length +
      sectionGap * (rows.length - 1) +
      sectionPadding * 2;

    section.style.height = `${expandedSectionHeight}px`;

    // Scroll handler — runs on every gsap tick
    function onScrollUpdate() {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      rows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const rowTop = rect.top + scrollY;
        const rowBottom = rowTop + rect.height;

        const scrollStart = rowTop - viewportHeight;
        const scrollEnd = rowBottom;

        let progress = (scrollY - scrollStart) / (scrollEnd - scrollStart);
        progress = Math.max(0, Math.min(1, progress));

        const width =
          rowStartWidth.current +
          (rowEndWidth.current - rowStartWidth.current) * progress;
        row.style.width = `${width}%`;
      });
    }

    gsap.ticker.add(onScrollUpdate);

    const handleResize = () => {
      const isMobile = window.innerWidth < 1000;
      rowStartWidth.current = isMobile ? 250 : 125;
      rowEndWidth.current = isMobile ? 750 : 500;

      firstRow.style.width = `${rowEndWidth.current}%`;
      const newRowHeight = firstRow.offsetHeight;
      firstRow.style.width = '';

      const newSectionHeight =
        newRowHeight * rows.length +
        sectionGap * (rows.length - 1) +
        sectionPadding * 2;

      section.style.height = `${newSectionHeight}px`;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      gsap.ticker.remove(onScrollUpdate);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Build rows data: TOTAL_ROWS rows, PROJECTS_PER_ROW items each, cycling through allItems
  const rowsData: GridItem[][] = [];
  let idx = 0;
  for (let r = 0; r < TOTAL_ROWS; r++) {
    const row: GridItem[] = [];
    for (let c = 0; c < PROJECTS_PER_ROW; c++) {
      row.push(allItems[idx % allItems.length]);
      idx++;
    }
    rowsData.push(row);
  }

  return (
    <section ref={sectionRef} className="expanding-grid">
      {rowsData.map((rowItems, rowIndex) => (
        <div
          key={rowIndex}
          className="expanding-grid-row"
          ref={(el) => {
            if (el) rowsRef.current[rowIndex] = el;
          }}
        >
          {rowItems.map((item, colIndex) => (
            <div key={colIndex} className="expanding-grid-item">
              <div className="expanding-grid-item-img">
                <img
                  src={item.img}
                  alt={item.name}
                  loading={rowIndex < 2 ? 'eager' : 'lazy'}
                />
              </div>
              <div className="expanding-grid-item-info">
                <p>{item.name}</p>
                <p>{localizeNum(item.year, locale)}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
