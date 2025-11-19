import { describe, expect, it } from 'vitest';
import { cn, configureAssistant, getSubjectColor } from '@/lib/utils';
import { ElevenLabsVoice } from '@vapi-ai/web/dist/api';

describe('cn', () => {
  it('merges class names and removes duplicates', () => {
    expect(cn('p-2', 'text-sm', false && 'hidden', 'p-4')).toBe('text-sm p-4');
  });
});

describe('getSubjectColor', () => {
  it('returns a configured color for a known subject', () => {
    expect(getSubjectColor('math')).toBe('#FFDA6E');
  });

  it('falls back to a neutral color when subject is unknown', () => {
    expect(getSubjectColor('unknown-subject')).toBe('#E5E5E5');
  });
});

describe('configureAssistant', () => {
  it('returns the matching ElevenLabs voice id for the given voice + style', () => {
    const assistant = configureAssistant('male', 'formal');
    expect((assistant.voice as ElevenLabsVoice).voiceId).toBe(
      'c6SfcYrb2t09NHXiT80T'
    );
  });

  it('defaults to "sarah" voice when the combo is not configured', () => {
    const assistant = configureAssistant('female', 'excited');
    expect((assistant.voice as ElevenLabsVoice).voiceId).toBe('sarah');
  });
});
