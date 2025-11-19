'use client';
import { cn, getSubjectColor, configureAssistant } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { callStatusEnum } from '@/constants';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import soundwaves from '@/constants/soundwaves.json';
import { addToSessionHistory } from '@/lib/actions/companion.actions';

interface TranscriptMessage {
  role: 'assistant' | 'user';
  text: string;
  timestamp: Date;
}

interface VapiMessage {
  type?: string;
  transcriptType?: 'partial' | 'final';
  role?: string;
  transcript?: string;
  [key: string]: unknown;
}

export default function CompanionComponent({
  companion,
  userName,
  userImage,
}: {
  companion: Companion;
  userName: string | null;
  userImage: string | null;
}) {
  const [callStatus, setCallStatus] = useState<callStatusEnum>(
    callStatusEnum.INACTIVE
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    if (lottieRef.current) {
      if (isSpeaking) {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
      }
    }
  }, [isSpeaking, lottieRef]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(callStatusEnum.ACTIVE);
      setTranscript([]);
    };

    const onCallEnd = () => {
      setCallStatus(callStatusEnum.COMPLETED);
      addToSessionHistory(companion.id);
    };

    const onMessage = (message: VapiMessage) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage: TranscriptMessage = {
          role: message.role === 'assistant' ? 'assistant' : 'user',
          text: message.transcript || '',
          timestamp: new Date(),
        };
        setTranscript((prev) => [...prev, newMessage]);
      }
    };

    const onCallError = (error: Error) => {
      console.error(error);
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('error', onCallError);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('error', onCallError);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
    };
  }, []);

  const handleMicClick = () => {
    vapi.setMuted(!isMuted);
    setIsMuted(!isMuted);
  };

  const handleCall = async () => {
    setCallStatus(callStatusEnum.CONNECTING);

    const assistantOverrides = {
      variableValues: {
        subject: companion.subject,
        topic: companion.topic,
        style: companion.style,
      },
    };

    vapi.start(
      configureAssistant(companion.voice, companion.style),
      assistantOverrides
    );
  };

  const handleDisconnect = () => {
    setCallStatus(callStatusEnum.COMPLETED);
    vapi.stop();
  };

  return (
    <section className='flex flex-col h-[70vh]'>
      <section className='flex gap-8 max-sm:flex-col'>
        <div className='companion-section'>
          <div
            className='companion-avatar'
            style={{ backgroundColor: getSubjectColor(companion.subject) }}
          >
            <div
              className={cn(
                'absolute transition-opacity duration-1000',
                callStatus === callStatusEnum.COMPLETED ||
                  callStatus === callStatusEnum.INACTIVE
                  ? 'opacity-1001'
                  : 'opacity-0',
                callStatus === callStatusEnum.CONNECTING &&
                  'opacity-100 animate-pulse'
              )}
            >
              <Image
                src={`/icons/${companion.subject}.svg`}
                alt={companion.subject}
                width={150}
                height={150}
                className='max-sm:w-fit'
              />
            </div>

            <div
              className={cn(
                'absolute transition-opacity duration-1000',
                callStatus === callStatusEnum.ACTIVE
                  ? 'opacity-100'
                  : 'opacity-0'
              )}
            >
              <Lottie
                lottieRef={lottieRef}
                animationData={soundwaves}
                autoplay={false}
                className='companion-lottie'
              />
            </div>
          </div>
          <p className='font-bold text-2xl'>{companion.title}</p>
        </div>
        <div className='user-section'>
          <div className='user-avatar'>
            {userImage && (
              <Image
                src={userImage}
                alt={userName || 'User Avatar'}
                width={130}
                height={130}
                className='rounded-lg'
              />
            )}
            {userName && <p className='font-bold text-2xl'>{userName}</p>}
          </div>
          <button
            className='btn-mic'
            onClick={handleMicClick}
            disabled={callStatus !== callStatusEnum.ACTIVE}
          >
            <Image
              src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'}
              alt='mic'
              width={36}
              height={36}
            />
            <p className='max-sm:hidden'>
              {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
            </p>
          </button>
          <button
            className={cn(
              'rounded-lg py-2 cursor-pointer transition-colors w-full text-white',
              callStatus === callStatusEnum.ACTIVE
                ? 'bg-red-700'
                : 'bg-primary',
              callStatus === callStatusEnum.CONNECTING && 'animate-pulse'
            )}
            onClick={
              callStatus === callStatusEnum.ACTIVE
                ? handleDisconnect
                : handleCall
            }
          >
            {callStatus === callStatusEnum.ACTIVE
              ? 'End Session'
              : callStatus === callStatusEnum.CONNECTING
              ? 'Connecting'
              : 'Start Session'}
          </button>
        </div>
      </section>

      <section className='transcript'>
        <div className='transcript-message no-scrollbar'>
          {transcript.map((message, index) => {
            if (message.role === 'assistant') {
              return (
                <p key={index} className='max-sm:text-sm'>
                  {companion.title.split(' ')[0].replace('/[.,]/g, ', '')}:{' '}
                  {message.text}
                </p>
              );
            } else {
              return (
                <p key={index} className='text-primary max-sm:text-sm'>
                  {userName}: {message.text}
                </p>
              );
            }
          })}
        </div>

        <div className='transcript-fade' />
      </section>
    </section>
  );
}
