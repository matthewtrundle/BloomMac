'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Mic, MicOff, FileText, Brain, Save, Download, 
  Clock, User, Calendar, Tag, Sparkles, Settings
} from 'lucide-react';

interface ClinicalNote {
  id: string;
  patient_id: string;
  patient_name: string;
  session_date: string;
  session_type: string;
  session_duration: number;
  raw_transcript: string;
  ai_summary: string;
  ai_assessment: string;
  ai_plan: string;
  mood_rating: number;
  progress_notes: string;
  next_session_recommendations: string[];
  tags: string[];
  status: 'draft' | 'reviewed' | 'finalized';
  created_at: string;
}

export default function AIClinicalNotesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [currentNote, setCurrentNote] = useState<Partial<ClinicalNote>>({
    patient_name: '',
    session_type: 'individual',
    session_duration: 60,
    mood_rating: 5,
    tags: [],
    status: 'draft'
  });
  const [notes, setNotes] = useState<ClinicalNote[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('new-note');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchExistingNotes();
    }
  }, [user]);

  const fetchExistingNotes = async () => {
    // Simulate fetching existing notes
    setNotes([
      {
        id: '1',
        patient_id: 'p1',
        patient_name: 'Sarah M.',
        session_date: '2025-01-06T14:00:00Z',
        session_type: 'individual',
        session_duration: 60,
        raw_transcript: 'Patient discussed challenges with sleep patterns and anxiety levels...',
        ai_summary: 'Patient reported continued difficulties with sleep onset, averaging 3-4 hours per night. Anxiety levels remain elevated, particularly around bedtime routines.',
        ai_assessment: 'Postpartum anxiety with sleep disturbance. Patient shows good insight and motivation for treatment. Responding well to cognitive behavioral techniques.',
        ai_plan: 'Continue CBT for anxiety. Introduce sleep hygiene protocol. Consider mindfulness meditation before bedtime. Follow up in 1 week.',
        mood_rating: 6,
        progress_notes: 'Slight improvement in anxiety management techniques',
        next_session_recommendations: [
          'Review sleep diary',
          'Practice progressive muscle relaxation',
          'Discuss partner support strategies'
        ],
        tags: ['anxiety', 'sleep', 'postpartum', 'CBT'],
        status: 'finalized',
        created_at: '2025-01-06T15:00:00Z'
      }
    ]);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Simulate voice recording
    setTranscript('');
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Simulate transcript
    setTranscript(`Patient reported feeling more confident in managing daily activities. Discussed coping strategies for overwhelming moments. Sleep patterns have improved from 4 to 6 hours per night. Patient expressed gratitude for progress made and feels ready to try new mindfulness techniques. Some anxiety remains around upcoming family visit but has specific strategies to manage this. Overall mood appears brighter and more optimistic than previous sessions.`);
  };

  const generateAINotes = async () => {
    if (!transcript || !currentNote.patient_name) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setCurrentNote(prev => ({
        ...prev,
        raw_transcript: transcript,
        ai_summary: 'Patient demonstrates continued improvement in daily functioning and sleep quality. Mood appears elevated compared to previous sessions. Anxiety levels are more manageable, though some situational triggers remain.',
        ai_assessment: `Clinical Assessment:
• Mood: Improved, more optimistic outlook
• Anxiety: Decreased from previous sessions, specific situational triggers identified
• Sleep: Significant improvement (4→6 hours nightly)
• Functioning: Enhanced confidence in daily activities
• Insight: Good awareness of coping strategies

Risk factors: Upcoming family stressor, continued mild anxiety
Protective factors: Improved sleep, enhanced coping skills, positive treatment engagement`,
        ai_plan: `Treatment Plan:
1. Continue current CBT approach - patient responding well
2. Introduce mindfulness meditation for anxiety management
3. Develop specific strategies for upcoming family visit
4. Maintain sleep hygiene protocols
5. Consider extending time between sessions if improvement continues

Next session focus: Stress management for family interactions`,
        next_session_recommendations: [
          'Review mindfulness practice implementation',
          'Develop family visit coping strategies',
          'Assess sleep diary entries',
          'Explore support system utilization'
        ],
        tags: ['improvement', 'anxiety-management', 'sleep-improvement', 'family-stress']
      }));
      setIsGenerating(false);
    }, 3000);
  };

  const saveNote = async () => {
    if (!currentNote.ai_summary) return;

    const newNote: ClinicalNote = {
      id: Date.now().toString(),
      patient_id: `p${Date.now()}`,
      patient_name: currentNote.patient_name || '',
      session_date: new Date().toISOString(),
      session_type: currentNote.session_type || 'individual',
      session_duration: currentNote.session_duration || 60,
      raw_transcript: currentNote.raw_transcript || '',
      ai_summary: currentNote.ai_summary || '',
      ai_assessment: currentNote.ai_assessment || '',
      ai_plan: currentNote.ai_plan || '',
      mood_rating: currentNote.mood_rating || 5,
      progress_notes: currentNote.progress_notes || '',
      next_session_recommendations: currentNote.next_session_recommendations || [],
      tags: currentNote.tags || [],
      status: 'draft',
      created_at: new Date().toISOString()
    };

    setNotes(prev => [newNote, ...prev]);
    
    // Reset form
    setCurrentNote({
      patient_name: '',
      session_type: 'individual',
      session_duration: 60,
      mood_rating: 5,
      tags: [],
      status: 'draft'
    });
    setTranscript('');
    
    alert('Clinical note saved successfully!');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading clinical notes...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-600" />
                AI Clinical Documentation
              </h1>
              <p className="text-gray-600 mt-1">Voice-powered session notes with intelligent insights</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'new-note', label: 'New Session Note', icon: FileText },
            { id: 'notes-history', label: 'Notes History', icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        {activeTab === 'new-note' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Session Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Information</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                  <input
                    type="text"
                    value={currentNote.patient_name}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, patient_name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <select
                    value={currentNote.session_type}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, session_type: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="individual">Individual Therapy</option>
                    <option value="couples">Couples Therapy</option>
                    <option value="family">Family Therapy</option>
                    <option value="group">Group Therapy</option>
                    <option value="consultation">Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <select
                    value={currentNote.session_duration}
                    onChange={(e) => setCurrentNote(prev => ({ ...prev, session_duration: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Voice Recording */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Voice Recording</h2>
                <div className="flex items-center gap-2">
                  {isRecording && (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Recording...</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center py-8">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </button>
                <p className="text-gray-600 mt-4">
                  {isRecording ? 'Click to stop recording' : 'Click to start recording session'}
                </p>
              </div>

              {transcript && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Session Transcript</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{transcript}</p>
                </div>
              )}
            </div>

            {/* AI Generation */}
            {transcript && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">AI-Generated Notes</h2>
                  <button
                    onClick={generateAINotes}
                    disabled={isGenerating}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Brain className="h-4 w-4" />
                    {isGenerating ? 'Generating...' : 'Generate AI Notes'}
                  </button>
                </div>

                {isGenerating && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">AI is analyzing the session...</p>
                  </div>
                )}

                {currentNote.ai_summary && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Session Summary</h3>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-gray-700">{currentNote.ai_summary}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Clinical Assessment</h3>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <pre className="text-gray-700 whitespace-pre-wrap text-sm">{currentNote.ai_assessment}</pre>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Treatment Plan</h3>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <pre className="text-gray-700 whitespace-pre-wrap text-sm">{currentNote.ai_plan}</pre>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mood Rating (1-10)</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={currentNote.mood_rating}
                          onChange={(e) => setCurrentNote(prev => ({ ...prev, mood_rating: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Very Low</span>
                          <span className="font-medium">{currentNote.mood_rating}/10</span>
                          <span>Very High</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {currentNote.tags?.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={saveNote}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Note
                      </button>
                      <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes-history' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Clinical Notes History</h2>
              <div className="space-y-4">
                {notes.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{note.patient_name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(note.session_date).toLocaleDateString()} • {note.session_type} • {note.session_duration}min
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        note.status === 'finalized' ? 'bg-green-100 text-green-800' :
                        note.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {note.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3">{note.ai_summary}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Mood: {note.mood_rating}/10</span>
                      <span>Tags: {note.tags.join(', ')}</span>
                      <span>Created: {new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}