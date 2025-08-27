import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useIssues } from "@/contexts/IssuesContext";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ReportIssues() {
  const { user } = useAuth();
  const { submitIssue, issues, loading } = useIssues();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    location: '',
    description: '',
    incidentDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.type || !formData.title || !formData.location || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const success = await submitIssue({
        type: mapIssueType(formData.type),
        title: formData.title,
        description: formData.description,
        location: { address: formData.location },
        priority: 'medium'
      });

      if (success) {
        setSubmitted(true);
        setFormData({
          type: '',
          title: '',
          location: '',
          description: '',
          incidentDate: ''
        });
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError('Failed to submit issue. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit issue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const mapIssueType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'missed': 'missed_pickup',
      'overflowing': 'overflowing_bin',
      'damaged': 'damaged_bin',
      'illegal': 'illegal_dumping',
      'other': 'other'
    };
    return typeMap[type] || type;
  };

  const getIssueTypeDisplay = (type: string) => {
    const types: { [key: string]: string } = {
      'missed_pickup': 'Missed Pickup',
      'missed': 'Missed Pickup',
      'overflowing_bin': 'Overflowing Bin',
      'overflowing': 'Overflowing Bin',
      'damaged_bin': 'Damaged Bin',
      'damaged': 'Damaged Bin',
      'illegal_dumping': 'Illegal Dumping',
      'illegal': 'Illegal Dumping',
      'other': 'Other'
    };
    return types[type] || type;
  };

  return (
    <DashboardLayout title="Report an Issue">
      <div className="max-w-4xl mx-auto space-y-6">
        {submitted && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your issue has been submitted successfully! Our team will review it shortly.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Submit New Issue */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Submit a New Issue</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="issueType">Issue Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="missed">Missed Pickup</SelectItem>
                      <SelectItem value="overflowing">Overflowing Bin</SelectItem>
                      <SelectItem value="damaged">Damaged Bin</SelectItem>
                      <SelectItem value="illegal">Illegal Dumping</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Issue Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Brief title for the issue"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Enter address or landmark"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Provide details about the issue"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incidentDate">Date of Incident</Label>
                  <Input
                    id="incidentDate"
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Issue'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Your Recent Issues */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Your Recent Issues</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <p className="text-gray-500 text-center py-4">Loading your issues...</p>
                ) : issues.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No issues reported yet.</p>
                ) : (
                  issues
                    .slice(0, 5)
                    .map((issue) => (
                      <div key={issue._id} className="p-4 border border-gray-200 rounded-lg bg-white/50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">{issue.title || getIssueTypeDisplay(issue.type)}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            issue.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {issue.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {issue.location?.address || issue.location}
                        </p>
                        <p className="text-xs text-gray-500">
                          {issue.description && issue.description.length > 50
                            ? `${issue.description.substring(0, 50)}...`
                            : issue.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Reported on {new Date(issue.createdAt || issue.reportedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
