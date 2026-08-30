import { getSilentAudioUrl } from '@/utils/silentAudio'

// The generated clip anchors the OS media session (see MediaSessionKeepAlive),
// so its properties are contractual: a valid PCM WAV, mono, longer than the
// ~5s "significant media" heuristic, and silent.
describe('silentAudio', () => {
  it('returns a blob object URL and caches it', () => {
    const url = getSilentAudioUrl()
    expect(url).to.match(/^blob:/)
    expect(getSilentAudioUrl()).to.equal(url)
  })

  it('generates a valid, silent, mono PCM WAV over 5s long', () => {
    const url = getSilentAudioUrl()

    cy.wrap(fetch(url).then((res) => res.arrayBuffer())).then((data) => {
      const buffer = data as ArrayBuffer
      const view = new DataView(buffer)
      const tag = (offset: number, length: number) =>
        new TextDecoder().decode(new Uint8Array(buffer, offset, length))

      expect(tag(0, 4)).to.equal('RIFF')
      expect(tag(8, 4)).to.equal('WAVE')
      expect(tag(12, 4)).to.equal('fmt ')
      expect(tag(36, 4)).to.equal('data')

      expect(view.getUint16(20, true), 'audio format (PCM)').to.equal(1)
      expect(view.getUint16(22, true), 'channels (mono)').to.equal(1)
      expect(view.getUint16(34, true), 'bits per sample').to.equal(8)

      const sampleRate = view.getUint32(24, true)
      const dataSize = view.getUint32(40, true)
      expect(dataSize).to.equal(buffer.byteLength - 44)
      expect(dataSize / sampleRate, 'duration (s)').to.be.greaterThan(5)

      // 8-bit PCM is unsigned; 128 is the zero level -> every sample silent.
      const samples = new Uint8Array(buffer, 44)
      expect(samples.every((sample) => sample === 128)).to.equal(true)
    })
  })
})
