import React from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ClosedCaption } from 'lucide-react';

interface SubtitleControlsProps {
  showSubtitles: boolean;
  setShowSubtitles: (show: boolean) => void;
  fontSize: "small" | "medium" | "large";
  setFontSize: (size: "small" | "medium" | "large") => void;
}

export const SubtitleControls: React.FC<SubtitleControlsProps> = ({
  showSubtitles,
  setShowSubtitles,
  fontSize,
  setFontSize,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center gap-3">
        <ClosedCaption className="w-5 h-5 text-primary" />
        <Label htmlFor="subtitles-toggle" className="font-medium">Live Subtitles</Label>
        <Switch
          id="subtitles-toggle"
          checked={showSubtitles}
          onCheckedChange={setShowSubtitles}
        />
      </div>
      
      <div className="flex items-center gap-3">
        <Label className="font-medium whitespace-nowrap">Font Size</Label>
        <Select value={fontSize} onValueChange={(v: any) => setFontSize(v)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
