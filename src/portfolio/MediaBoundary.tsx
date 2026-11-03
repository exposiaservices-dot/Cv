import { Component, type ReactNode } from 'react';
import type { GalleryLabels } from './types';

export class MediaBoundary extends Component<{ children: ReactNode; labels: GalleryLabels; onClose: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <div role="alert">{this.props.labels.error} <button type="button" onClick={this.props.onClose}>{this.props.labels.close}</button></div>
      : this.props.children;
  }
}
