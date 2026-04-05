import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  MessageSquare, CheckCircle, XCircle, Clock, DollarSign, 
  AlertCircle, User, Building2, Send 
} from 'lucide-react';
import { CountdownTimer } from '../components/CountdownTimer';
import { Alert, AlertDescription } from '../components/ui/alert';
import { mockJobs, mockNegotiations } from '../services/mockData';
import { toast } from 'sonner';

interface NegotiationMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'worker' | 'business';
  message: string;
  timestamp: string;
}

const mockMessages: NegotiationMessage[] = [
  {
    id: 'msg1',
    senderId: 'w2',
    senderName: 'Jane Smith',
    senderRole: 'worker',
    message: 'Based on my experience with similar projects, I believe a rate of $75/hr is more appropriate. I have 5+ years of experience in UX design and have successfully completed over 20 similar projects.',
    timestamp: '2026-03-30T10:00:00Z',
  },
  {
    id: 'msg2',
    senderId: 'b2',
    senderName: 'Creative Agency',
    senderRole: 'business',
    message: 'Thank you for your proposal. We appreciate your experience. We can offer $72/hr, which is above our standard rate but reflects your strong portfolio.',
    timestamp: '2026-03-30T14:30:00Z',
  },
];

export const Negotiation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<NegotiationMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [workerAccepted, setWorkerAccepted] = useState(false);
  const [businessAccepted, setBusinessAccepted] = useState(false);
  const [acceptanceReset, setAcceptanceReset] = useState(false); // Track if acceptance was reset due to job change

  const jobId = searchParams.get('job');
  const negotiationId = searchParams.get('id') || 'n1';

  // Get negotiation data
  const negotiation = mockNegotiations.find(n => n.id === negotiationId);
  const job = negotiation ? mockJobs.find(j => j.id === negotiation.jobId) : null;

  if (!negotiation || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <MessageSquare className="size-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl mb-2">Negotiation Not Found</h3>
            <Button onClick={() => navigate(user?.role === 'worker' ? '/worker/interested' : '/business/dashboard')}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isWorker = user?.role === 'worker';
  const isExpired = new Date(negotiation.expiresAt) < new Date();
  const otherPartyName = isWorker ? job.businessName : 'Worker';

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const message: NegotiationMessage = {
      id: `msg${messages.length + 1}`,
      senderId: user?.id || '',
      senderName: user?.name || '',
      senderRole: user?.role === 'worker' ? 'worker' : 'business',
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const handlePropose = () => {
    const rate = parseFloat(proposedRate);
    if (!rate || rate <= 0) {
      toast.error('Please enter a valid rate');
      return;
    }

    const message: NegotiationMessage = {
      id: `msg${messages.length + 1}`,
      senderId: user?.id || '',
      senderName: user?.name || '',
      senderRole: user?.role === 'worker' ? 'worker' : 'business',
      message: `I propose a rate of $${rate}/hour for this position.`,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setProposedRate('');
    toast.success('Rate proposal sent');
  };

  const handleAccept = () => {
    if (isWorker) {
      setWorkerAccepted(true);
    } else {
      setBusinessAccepted(true);
    }
    toast.success('You have accepted the terms');
    
    // Check if both accepted
    if ((isWorker && businessAccepted) || (!isWorker && workerAccepted)) {
      toast.success('Both parties have accepted! The deal is confirmed.');
    }
  };

  const handleReject = () => {
    toast.error('Negotiation rejected');
    setTimeout(() => {
      navigate(isWorker ? '/worker/interested' : '/business/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Warning Banner */}
      {isExpired ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="size-4" />
          <AlertDescription>
            <strong>This negotiation has expired.</strong> No further actions can be taken.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <AlertCircle className="size-4 text-blue-600" />
            <AlertDescription>
              <strong>Active Negotiation:</strong> You cannot apply to other jobs or initiate new negotiations while this is active.
            </AlertDescription>
          </Alert>
          {acceptanceReset && (
            <Alert className="mb-6 border-orange-500 bg-orange-50">
              <AlertCircle className="size-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Acceptance Reset:</strong> The job posting was edited. Previous acceptances have been reset and both parties must re-accept the updated terms.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Negotiation Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Negotiation for: {job.title}</CardTitle>
                  <p className="text-gray-600">Discussing terms with {otherPartyName}</p>
                </div>
                {!isExpired && (
                  <div className="text-right">
                    <CountdownTimer targetDate={negotiation.expiresAt} label="Expires in" />
                  </div>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Negotiation Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                {messages.map((msg) => {
                  const isMyMessage = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${isMyMessage ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          {msg.senderRole === 'worker' ? (
                            <User className="size-4" />
                          ) : (
                            <Building2 className="size-4" />
                          )}
                          <span className="font-semibold text-sm">{msg.senderName}</span>
                          <span className="text-xs text-gray-600">
                            {new Date(msg.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isExpired && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={3}
                      className="flex-1"
                    />
                  </div>
                  <Button onClick={handleSendMessage} className="w-full">
                    <Send className="size-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rate Proposal */}
          {!isExpired && (
            <Card>
              <CardHeader>
                <CardTitle>Propose New Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="proposedRate">Proposed Hourly Rate ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <Input
                          id="proposedRate"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="75.00"
                          value={proposedRate}
                          onChange={(e) => setProposedRate(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handlePropose}>
                        Propose Rate
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Current proposed rate: <strong>${negotiation.proposedPayRate}/hr</strong> (Original: ${negotiation.originalPayRate}/hr)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Negotiation Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Worker</span>
                  {workerAccepted ? (
                    <Badge className="bg-green-100 text-green-800 gap-1">
                      <CheckCircle className="size-3" />
                      Accepted
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Pending
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Business</span>
                  {businessAccepted ? (
                    <Badge className="bg-green-100 text-green-800 gap-1">
                      <CheckCircle className="size-3" />
                      Accepted
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>

              {isExpired ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    This negotiation has expired
                  </AlertDescription>
                </Alert>
              ) : workerAccepted && businessAccepted ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="size-4 text-green-600" />
                  <AlertDescription className="text-green-900">
                    <strong>Deal Confirmed!</strong> Both parties have accepted the terms.
                  </AlertDescription>
                </Alert>
              ) : (
                <p className="text-sm text-gray-600">
                  Both parties must accept the terms to finalize the agreement
                </p>
              )}
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Position</span>
                <p className="font-semibold">{job.title}</p>
              </div>
              <div>
                <span className="text-gray-600">Business</span>
                <p className="font-semibold">{job.businessName}</p>
              </div>
              <div>
                <span className="text-gray-600">Location</span>
                <p className="font-semibold">{job.location}</p>
              </div>
              <div>
                <span className="text-gray-600">Original Rate</span>
                <p className="font-semibold">${job.payRate}/hour</p>
              </div>
              <div>
                <span className="text-gray-600">Duration</span>
                <p className="font-semibold">
                  {new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {!isExpired && (
            <Card className={workerAccepted && businessAccepted ? 'bg-green-50 border-green-200' : ''}>
              <CardContent className="pt-6 space-y-3">
                {!(workerAccepted && businessAccepted) && (
                  <>
                    <Button 
                      className="w-full"
                      onClick={handleAccept}
                      disabled={(isWorker && workerAccepted) || (!isWorker && businessAccepted)}
                    >
                      <CheckCircle className="size-4 mr-2" />
                      {(isWorker && workerAccepted) || (!isWorker && businessAccepted)
                        ? 'You Accepted'
                        : 'Accept Terms'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleReject}
                    >
                      <XCircle className="size-4 mr-2" />
                      Reject & End Negotiation
                    </Button>
                  </>
                )}
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate(isWorker ? '/worker/interested' : '/business/dashboard')}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};