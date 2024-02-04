import { useState } from "react";
import { Search } from "./components/Search";
import { CommentSection } from "./components/CommentSection";
import { SongDetails } from "./types";


export function MyComponent(props: any) {
  const [selectedTrack, setSelectedTrack] = useState<SongDetails>();

  const handleTrackSelection = ({ name, trackId }: SongDetails) => {
    setSelectedTrack({ name, trackId });
  };

  return (
    <>
      <Search onTrackSelect={handleTrackSelection} />
      {selectedTrack && <CommentSection songDetails={selectedTrack} />}
    </>
  );
}


