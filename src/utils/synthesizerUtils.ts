import { Sampler, Transport, Loop, Analyser } from "tone";

type SampleMap = { [note: string]: string };
type Options = {
  playbackRate?: number;
};

class MelodySampler {
  public sampler: Sampler;
  public analyser: Analyser;
  private melodyLoop: Loop;
  private selectedMelody: string; // The key of the current melody sample
  private currentMelody: string; // The key of the current melody sample
  private pauseTime: number | null;
  public loaded: boolean;

  constructor(sampleMap: SampleMap) {
    this.loaded = false;
    this.selectedMelody = ""; // Initialize with no melody
    this.pauseTime = null;

    this.sampler = new Sampler(sampleMap, () => {
      this.loaded = true;
      console.log("Melody samples loaded.");
    }).toDestination();

    // Add an analyser node
    this.analyser = new Analyser("waveform", 1024);
    this.sampler.connect(this.analyser);

    // Initialize the loop with the sample duration
    this.melodyLoop = new Loop((time) => {
      console.log("melody log");
      if (this.selectedMelody) {
        // Play the current melody sample
        this.sampler.triggerAttack(this.selectedMelody, time || 0);

        // Since the sample is 8 seconds long, no need for 'triggerRelease'
      }
    }, "8.25"); // Loop interval set to 8.25 seconds, adjust as per exact sample duration

    Transport.start(Transport.now() + 0.1);
  }

  public isLoaded(): boolean {
    return this.loaded;
  }

  // Method to play a melody once
  public playOnce(melodyKey: string): void {
    if (this.currentMelody !== melodyKey) {
      this.stopAllMelodies();
      this.currentMelody = melodyKey;
      this.sampler.triggerAttack(melodyKey);

      // Set a timeout to clear currentMelody after the sample has finished playing
      // Assuming the sample duration is known (e.g., 8.25 seconds)
      const sampleDuration = 8250; // Replace with actual sample duration in milliseconds
      setTimeout(() => {
        if (this.currentMelody === melodyKey) {
          this.currentMelody = "";
        }
      }, sampleDuration);
    } else {
      console.log("The same melody is already playing.");
    }
  }

  // Method to start playing a melody loop
  public startSelectedMelody(): void {
    console.log("Starting melody loop at time:" + this.pauseTime || 0);
    this.stopAllMelodies();
    if (this.selectedMelody) {
      // this.sampler.triggerAttack(this.selectedMelody);
      if (!this.melodyLoop.state || this.melodyLoop.state !== "started") {
        // Start the loop immediately at the current Transport time
        this.melodyLoop.start(Transport.now());
      }
    }
  }

  // Method to change the selected melody
  public selectMelody(newMelodyKey: string): void {
    this.selectedMelody = newMelodyKey;
  }

  // Method to stop the melody
  public stopSelectedMelody(): void {
    if (this.melodyLoop.state === "started") {
      this.melodyLoop.stop();
    }
  }

  // Method to stop all melodies
  public stopAllMelodies(): void {
    console.log("stopping");
    if (this.currentMelody) {
      this.sampler.triggerRelease(this.currentMelody);
    }
    if (this.selectedMelody) {
      this.sampler.triggerRelease(this.selectedMelody);
    }
    this.currentMelody = "";
  }

  // Method to pause the melody
  public pauseMelody(): void {
    console.log("Pausing the melody.");
    if (this.currentMelody) {
      console.log("Pausing the current melody.");
      this.sampler.triggerRelease(this.currentMelody);
    }
    if (this.melodyLoop.state === "started") {
      console.log("Pausing the melody in loop at time: ", Transport.seconds);

      this.melodyLoop.stop();
      this.pauseTime = Transport.seconds; // Store the current Transport time
      this.sampler.triggerRelease(this.selectedMelody);
    }
  }

  // Method to resume the melody
  public resumeMelody(): void {
    console.log("Resuming the melody.");
    if (this.currentMelody) {
      console.log("Current melody is not meant to be resumed.");
      this.currentMelody = "";
      // Do nothing
    }
    if (this.selectedMelody) {
      console.log("Resuming selected melody.");

      // Trigger the melody immediately
      // this.sampler.triggerAttack(this.selectedMelody, Transport.now());

      // Then start the loop
      if (!this.melodyLoop.state || this.melodyLoop.state !== "started") {
        this.melodyLoop.start(Transport.now());
      }
    }
  }
}

class BeatSampler {
  public sampler: Sampler;
  public samples: string[];
  public samplesLength: number;
  public analyser: Analyser;
  private currentBeat: string;
  private beatLoop: Loop;
  public loaded: boolean;
  private currentSampleIndex: number;
  private pauseIndex: number | null;
  private pauseTime: number | null;

  constructor(sampleMap: SampleMap, samplesLength: number) {
    this.loaded = false;
    this.samples = [];
    this.samplesLength = samplesLength;
    this.currentSampleIndex = 0;
    this.pauseIndex = null;
    this.pauseTime = null;

    // Create a new Tone.Sampler and load the samples
    this.sampler = new Sampler(sampleMap, () => {
      this.loaded = true;
      console.log("Beat samples loaded.");
    }).toDestination();

    // Add an analyser node
    this.analyser = new Analyser("waveform", 1024);
    this.sampler.connect(this.analyser);

    // Initialize the loop with the sample duration
    this.beatLoop = new Loop((time) => {
      if (this.samples.length > 0) {
        // Play the current beat sample
        console.log(
          "Playing beat in loop: ",
          this.samples[this.currentSampleIndex]
        );
        this.sampler.triggerAttack(this.samples[this.currentSampleIndex], time);

        // Move to the next sample, looping back if at the end
        this.currentSampleIndex =
          (this.currentSampleIndex + 1) % this.samples.length;
      }
    }, "+1"); // Loop interval set to 8 seconds, adjust as per exact sample duration

    Transport.bpm.value = 125;
    Transport.start();
  }

  public isLoaded(): boolean {
    return this.loaded;
  }

  public playOnce(beat: string, options?: Options): void {
    if (this.currentBeat !== beat) {
      if (this.loaded) {
        const playbackRate = options?.playbackRate ?? 1;

        // Schedule the note to be played on the next beat
        Transport.schedule((time) => {
          this.sampler.triggerAttackRelease(beat, "4n", time, playbackRate);
        }, "+0.1"); // "@1m" means the next measure
      } else {
        console.log("Beat samples are not loaded yet.");
      }
    } else {
      console.log("The same beat is already playing.");
    }
  }

  public selectBeat(note: string): void {
    if (this.loaded) {
      if (this.samples.length < this.samplesLength) {
        console.log("Selecting beat: ", note);
        this.samples.push(note);
      } else {
        console.log("Beat samples are full.");
      }
    }
  }

  // Method to start playing a melody loop
  public startSelectedBeats(): void {
    console.log("Starting beats loop.");
    if (!this.beatLoop.state || this.beatLoop.state !== "started") {
      this.stopAllBeats();
      this.beatLoop.start(0);
    } else {
      // If the same melody is already playing in loop, do nothing
      console.log("The same melody is already playing in loop.");
    }
  }

  // Method to stop the melody
  public stopSelectedBeats(): void {
    if (this.beatLoop.state === "started") {
      this.beatLoop.stop();
    }
  }

  // Method to stop all melodies
  public stopAllBeats(): void {
    if (this.currentBeat) {
      this.sampler.triggerRelease(this.currentBeat);
      this.currentBeat = "";
    }
  }

  // Method to pause the beat loop
  public pauseBeats(): void {
    if (this.beatLoop.state === "started") {
      this.beatLoop.stop();
      this.pauseIndex = this.currentSampleIndex; // Store the current index
      this.pauseTime = Transport.seconds; // Store the current Transport time
    }
  }

  // Method to resume the beat loop
  public resumeBeats(): void {
    if (
      this.samples.length > 0 &&
      this.pauseIndex != null &&
      this.pauseTime != null
    ) {
      this.currentSampleIndex = this.pauseIndex; // Resume from the stored index
      Transport.seconds = this.pauseTime; // Resume from the stored time
      this.startSelectedBeats();
    }
  }
}

// Define the mapping from notes to sample URLs
const beatMap: SampleMap = {
  C2: "public/sounds/48.wav", // Snap
  D2: "public/sounds/45.wav", // Blip
  E2: "public/sounds/117.wav", // Knock
  F2: "public/sounds/108.wav", // Tom
  G2: "public/sounds/104.wav", // Snap dry
  A2: "public/sounds/112.wav", // Ting
  B2: "public/sounds/98.wav", // Bass
  C3: "public/sounds/105.wav", // Deep
  D3: "public/sounds/106.wav", // Bass low
  // ... add more samples if needed
};

// Define the mapping from notes to sample URLs
const melodyMap: SampleMap = {
  C2: "public/sounds/97.wav",
  D2: "public/sounds/120.wav",
  E2: "public/sounds/122.wav",
  // ... add more samples if needed
};

// Example of using the SampleSynthesizer
const melodySampler = new MelodySampler(melodyMap);
const beatSampler = new BeatSampler(beatMap, 5);

// Export the synthesizer for use in other parts of the application
export { melodySampler, beatSampler };
