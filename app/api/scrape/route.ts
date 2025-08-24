import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { Entry } from '@/lib/types';
import { getFilteredData } from '@/lib/filters';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') as 'long' | 'short' | 'all' || 'all';
    
    const response = await fetch('https://news.ycombinator.com/');
    const html = await response.text();
    
    const $ = cheerio.load(html);
    const entries: Entry[] = [];
    
    $('.athing').each((index, element) => {
      const $element = $(element);
      const titleElement = $element.find('.titleline a').first();
      const title = titleElement.text().trim();
      
      const detailsRow = $element.next('.athing + tr');
      const pointsText = detailsRow.find('.score').text().trim();
      const points = parseInt(pointsText.replace(/\D/g, '')) || 0;
      
      const commentsText = detailsRow.find('a').last().text().trim();
      const comments = parseInt(commentsText.replace(/\D/g, '')) || 0;
      
      entries.push({
        id: index + 1,
        title,
        points,
        comments
      });
    });
    
    // Apply filtering
    const filteredEntries = getFilteredData(entries, filter);
    
    return NextResponse.json(filteredEntries);
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ error: 'Failed to scrape data' }, { status: 500 });
  }
}
