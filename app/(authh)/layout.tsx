export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="h-screen overflow-hidden relative">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/AnimeGirl .mp4" type="video/mp4"/>
      </video>
      <div className="absolute inset-0 bg-black/45 "/>
      <div className="relative z-10">
        {children}
      </div>
      
    </div>
  );
}
