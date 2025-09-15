import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Privacy Policy • RECOMMEND',
  description: 'Privacy policy for the RECOMMEND app - no tracking, server-side processing only.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-title font-mono font-black mb-8 text-black">
        Privacy Policy
      </h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>No Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono font-medium mb-4">
              RECOMMEND does not use cookies, analytics, or any tracking mechanisms by default. 
              We respect your privacy and don't collect personal data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="font-mono font-medium space-y-2">
              <li>• Your seed songs/movies are processed by our recommendation engine</li>
              <li>• No personal information is sent - only the titles and creators you provide</li>
              <li>• Recommendations are generated server-side and returned to you</li>
              <li>• We don't store your seeds or recommendations on our servers</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono font-medium mb-4">
              The app stores your last used seeds and preferences in your browser's local storage 
              for convenience. This data never leaves your device and you can clear it anytime 
              by clearing your browser data.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rate Limiting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono font-medium mb-4">
              We implement basic rate limiting based on IP address to prevent abuse. 
              This temporary data is not stored permanently and resets when the server restarts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono font-medium mb-4">
              This app uses advanced AI technology to generate recommendations.
              All processing is done server-side to protect your privacy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono font-medium">
              If you have questions about privacy, please check the project repository on GitHub.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}