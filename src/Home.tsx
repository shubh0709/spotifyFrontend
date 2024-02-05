import { useState } from "react";
import { Search } from "./components/Search";
import { CommentSection } from "./components/CommentSection";
import { SongDetails } from "./types";


export function Home({ username }: { username: string }) {
  const [selectedTrack, setSelectedTrack] = useState<SongDetails>();

  const handleTrackSelection = ({ name, trackId }: SongDetails) => {
    setSelectedTrack({ name, trackId });
  };

  return (
    <>
      <Search onTrackSelect={handleTrackSelection} />
      {selectedTrack && <CommentSection songDetails={selectedTrack} username={username} />}
    </>
  );
}


