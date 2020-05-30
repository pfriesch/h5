// ==++==
//
//   Copyright (c) Microsoft Corporation.  All rights reserved.
//
// ==--==
/*============================================================
**
** Class:  StreamReader
**
** <OWNER>gpaperin</OWNER>
**
**
** Purpose: For reading text from streams in a particular
** encoding.
**
**
===========================================================*/

using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Runtime.Versioning;
using System.Diagnostics.CodeAnalysis;
using System.Diagnostics.Contracts;
using System.Security.Permissions;
using System.Threading.Tasks;

namespace System.IO
{
    // This class implements a TextReader for reading characters to a Stream.
    // This is designed for character input in a particular Encoding,
    // whereas the Stream class is designed for byte input and output.
    //
    public class StreamReader : TextReader
    {
        // StreamReader.Null is threadsafe.
        public new static readonly StreamReader Null = new NullStreamReader();

        // Using a 1K byte buffer and a 4K FileStream buffer works out pretty well
        // perf-wise.  On even a 40 MB text file, any perf loss by using a 4K
        // buffer is negated by the win of allocating a smaller byte[], which
        // saves construction time.  This does break adaptive buffering,
        // but this is slightly faster.
        internal static int DefaultBufferSize
        {
            get
            {
                return 1024;
            }
        }

        private const int DefaultFileStreamBufferSize = 4096;
        private const int MinBufferSize = 128;

        private Stream stream;
        private Encoding encoding;
        private byte[] byteBuffer;
        private char[] charBuffer;
        private int charPos;
        private int charLen;
        // Record the number of valid bytes in the byteBuffer, for a few checks.
        private int byteLen;
        // This is used only for preamble detection
        private int bytePos;

        // This is the maximum number of chars we can get from one call to
        // ReadBuffer.  Used so ReadBuffer can tell when to copy data into
        // a user's char[] directly, instead of our internal char[].
        private int _maxCharsPerBuffer;

        // We will support looking for byte order marks in the stream and trying
        // to decide what the encoding might be from the byte order marks, IF they
        // exist.  But that's all we'll do.
        private bool _detectEncoding;

        // Whether the stream is most likely not going to give us back as much
        // data as we want the next time we call it.  We must do the computation
        // before we do any byte order mark handling and save the result.  Note
        // that we need this to allow users to handle streams used for an
        // interactive protocol, where they block waiting for the remote end
        // to send a response, like logging in on a Unix machine.
        private bool _isBlocked;

        // The intent of this field is to leave open the underlying stream when
        // disposing of this StreamReader.  A name like _leaveOpen is better,
        // but this type is serializable, and this field's name was _closable.
        private bool _closable;  // Whether to close the underlying stream.

        // StreamReader by default will ignore illegal UTF8 characters. We don't want to
        // throw here because we want to be able to read ill-formed data without choking.
        // The high level goal is to be tolerant of encoding errors when we read and very strict
        // when we write. Hence, default StreamWriter encoding will throw on error.

        internal StreamReader()
        {
        }

        public StreamReader(Stream stream)
            : this(stream, true)
        {
        }

        public StreamReader(Stream stream, bool detectEncodingFromByteOrderMarks)
            : this(stream, Encoding.UTF8, detectEncodingFromByteOrderMarks, DefaultBufferSize, false)
        {
        }

        public StreamReader(Stream stream, Encoding encoding)
            : this(stream, encoding, true, DefaultBufferSize, false)
        {
        }

        public StreamReader(Stream stream, Encoding encoding, bool detectEncodingFromByteOrderMarks)
            : this(stream, encoding, detectEncodingFromByteOrderMarks, DefaultBufferSize, false)
        {
        }

        // Creates a new StreamReader for the given stream.  The
        // character encoding is set by encoding and the buffer size,
        // in number of 16-bit characters, is set by bufferSize.
        //
        // Note that detectEncodingFromByteOrderMarks is a very
        // loose attempt at detecting the encoding by looking at the first
        // 3 bytes of the stream.  It will recognize UTF-8, little endian
        // unicode, and big endian unicode text, but that's it.  If neither
        // of those three match, it will use the Encoding you provided.
        //
        public StreamReader(Stream stream, Encoding encoding, bool detectEncodingFromByteOrderMarks, int bufferSize)
            : this(stream, encoding, detectEncodingFromByteOrderMarks, bufferSize, false)
        {
        }

        public StreamReader(Stream stream, Encoding encoding, bool detectEncodingFromByteOrderMarks, int bufferSize, bool leaveOpen)
        {
            if (stream == null || encoding == null)
                throw new ArgumentNullException((stream == null ? "stream" : "encoding"));
            if (!stream.CanRead)
                throw new ArgumentException();
            if (bufferSize <= 0)
                throw new ArgumentOutOfRangeException("bufferSize");
            Contract.EndContractBlock();

            Init(stream, encoding, detectEncodingFromByteOrderMarks, bufferSize, leaveOpen);
        }

        public StreamReader(string path) : this(path, true)
        {
        }

        public StreamReader(string path, bool detectEncodingFromByteOrderMarks)
            : this(path, Encoding.UTF8, detectEncodingFromByteOrderMarks, DefaultBufferSize)
        {
        }

        public StreamReader(string path, Encoding encoding)
            : this(path, encoding, true, DefaultBufferSize)
        {
        }

        public StreamReader(string path, Encoding encoding, bool detectEncodingFromByteOrderMarks)
            : this(path, encoding, detectEncodingFromByteOrderMarks, DefaultBufferSize)
        {
        }

        public StreamReader(string path, Encoding encoding, bool detectEncodingFromByteOrderMarks, int bufferSize)
            : this(path, encoding, detectEncodingFromByteOrderMarks, bufferSize, true)
        {
        }

        internal StreamReader(string path, Encoding encoding, bool detectEncodingFromByteOrderMarks, int bufferSize, bool checkHost)
        {
            // Don't open a Stream before checking for invalid arguments,
            // or we'll create a FileStream on disk and we won't close it until
            // the finalizer runs, causing problems for applications.
            if (path == null || encoding == null)
                throw new ArgumentNullException((path == null ? "path" : "encoding"));
            if (path.Length == 0)
                throw new ArgumentException();
            if (bufferSize <= 0)
                throw new ArgumentOutOfRangeException("bufferSize");
            Contract.EndContractBlock();

            Stream stream = new FileStream(path, FileMode.Open);
            Init(stream, encoding, detectEncodingFromByteOrderMarks, bufferSize, false);
        }

        private void Init(Stream stream, Encoding encoding, bool detectEncodingFromByteOrderMarks, int bufferSize, bool leaveOpen)
        {
            this.stream = stream;
            this.encoding = encoding;
            if (bufferSize < MinBufferSize) bufferSize = MinBufferSize;
            byteBuffer = new byte[bufferSize];
            _maxCharsPerBuffer = encoding.GetMaxCharCount(bufferSize);
            charBuffer = new char[_maxCharsPerBuffer];
            byteLen = 0;
            bytePos = 0;
            _detectEncoding = detectEncodingFromByteOrderMarks;
            _isBlocked = false;
            _closable = !leaveOpen;
        }

        // Init used by NullStreamReader, to delay load encoding
        internal void Init(Stream stream)
        {
            this.stream = stream;
            _closable = true;
        }

        public override void Close()
        {
            Dispose(true);
        }

        protected override void Dispose(bool disposing)
        {
            // Dispose of our resources if this StreamReader is closable.
            // Note that Console.In should be left open.
            try
            {
                // Note that Stream.Close() can potentially throw here. So we need to
                // ensure cleaning up internal resources, inside the finally block.
                if (!LeaveOpen && disposing && (stream != null))
                    stream.Close();
            }
            finally
            {
                if (!LeaveOpen && (stream != null))
                {
                    stream = null;
                    encoding = null;
                    byteBuffer = null;
                    charBuffer = null;
                    charPos = 0;
                    charLen = 0;
                    base.Dispose(disposing);
                }
            }
        }

        public virtual Encoding CurrentEncoding
        {
            get
            {
                return encoding;
            }
        }

        public virtual Stream BaseStream
        {
            get
            {
                return stream;
            }
        }

        internal bool LeaveOpen
        {
            get
            {
                return !_closable;
            }
        }

        // DiscardBufferedData tells StreamReader to throw away its internal
        // buffer contents.  This is useful if the user needs to seek on the
        // underlying stream to a known location then wants the StreamReader
        // to start reading from this new point.  This method should be called
        // very sparingly, if ever, since it can lead to very poor performance.
        // However, it may be the only way of handling some scenarios where
        // users need to re-read the contents of a StreamReader a second time.
        public void DiscardBufferedData()
        {

            byteLen = 0;
            charLen = 0;
            charPos = 0;
            _isBlocked = false;
        }

        public bool EndOfStream
        {
            get
            {
                if (stream == null)
                    __Error.ReaderClosed();


                if (charPos < charLen)
                    return false;

                // This may block on pipes!
                int numRead = ReadBuffer();
                return numRead == 0;
            }
        }

        [Pure]
        public override int Peek()
        {
            if (stream == null)
                __Error.ReaderClosed();

            if (charPos == charLen)
            {
                if (_isBlocked || ReadBuffer() == 0) return -1;
            }
            return charBuffer[charPos];
        }

        public override int Read()
        {
            if (stream == null)
                __Error.ReaderClosed();


            if (charPos == charLen)
            {
                if (ReadBuffer() == 0) return -1;
            }
            int result = charBuffer[charPos];
            charPos++;
            return result;
        }

        public override int Read([In, Out] char[] buffer, int index, int count)
        {
            if (buffer == null)
                throw new ArgumentNullException("buffer");
            if (index < 0 || count < 0)
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"));
            if (buffer.Length - index < count)
                throw new ArgumentException();
            Contract.EndContractBlock();

            if (stream == null)
                __Error.ReaderClosed();


            int charsRead = 0;
            // As a perf optimization, if we had exactly one buffer's worth of
            // data read in, let's try writing directly to the user's buffer.
            bool readToUserBuffer = false;
            while (count > 0)
            {
                int n = charLen - charPos;
                if (n == 0) n = ReadBuffer(buffer, index + charsRead, count, out readToUserBuffer);
                if (n == 0) break;  // We're at EOF
                if (n > count) n = count;
                if (!readToUserBuffer)
                {
                    Array.Copy(charBuffer, charPos, buffer, (index + charsRead), n);
                    charPos += n;
                }
                charsRead += n;
                count -= n;
                // This function shouldn't block for an indefinite amount of time,
                // or reading from a network stream won't work right.  If we got
                // fewer bytes than we requested, then we want to break right here.
                if (_isBlocked)
                    break;
            }

            return charsRead;
        }

        public override async Task<string> ReadToEndAsync()
        {
            if (this.stream is FileStream)
            {
                await this.stream.As<FileStream>().EnsureBufferAsync();
            }

            return await base.ReadToEndAsync();
        }

        public override string ReadToEnd()
        {
            if (stream == null)
                __Error.ReaderClosed();

            // Call ReadBuffer, then pull data out of charBuffer.
            StringBuilder sb = new StringBuilder(charLen - charPos);
            do
            {
                sb.Append(new string(charBuffer, charPos, charLen - charPos));
                charPos = charLen;  // Note we consumed these characters
                ReadBuffer();
            } while (charLen > 0);
            return sb.ToString();
        }

        public override int ReadBlock([In, Out] char[] buffer, int index, int count)
        {
            if (buffer == null)
                throw new ArgumentNullException("buffer");
            if (index < 0 || count < 0)
                throw new ArgumentOutOfRangeException((index < 0 ? "index" : "count"));
            if (buffer.Length - index < count)
                throw new ArgumentException();
            Contract.EndContractBlock();

            if (stream == null)
                __Error.ReaderClosed();

            return base.ReadBlock(buffer, index, count);
        }

        // Trims n bytes from the front of the buffer.
        private void CompressBuffer(int n)
        {
            Contract.Assert(byteLen >= n, "CompressBuffer was called with a number of bytes greater than the current buffer length.  Are two threads using this StreamReader at the same time?");
            Array.Copy(byteBuffer, n, byteBuffer, 0, byteLen - n);
            byteLen -= n;
        }

        private void DetectEncoding()
        {
            if (byteLen < 2)
                return;
            _detectEncoding = false;
            bool changedEncoding = false;
            if (byteBuffer[0] == 0xFE && byteBuffer[1] == 0xFF)
            {
                // Big Endian Unicode

                encoding = new UnicodeEncoding(true, true);
                CompressBuffer(2);
                changedEncoding = true;
            }

            else if (byteBuffer[0] == 0xFF && byteBuffer[1] == 0xFE)
            {
                // Little Endian Unicode, or possibly little endian UTF32
                if (byteLen < 4 || byteBuffer[2] != 0 || byteBuffer[3] != 0)
                {
                    encoding = new UnicodeEncoding(false, true);
                    CompressBuffer(2);
                    changedEncoding = true;
                }
                else
                {
                    encoding = new UTF32Encoding(false, true);
                    CompressBuffer(4);
                    changedEncoding = true;
                }
            }

            else if (byteLen >= 3 && byteBuffer[0] == 0xEF && byteBuffer[1] == 0xBB && byteBuffer[2] == 0xBF)
            {
                // UTF-8
                encoding = Encoding.UTF8;
                CompressBuffer(3);
                changedEncoding = true;
            }
            else if (byteLen >= 4 && byteBuffer[0] == 0 && byteBuffer[1] == 0 &&
                     byteBuffer[2] == 0xFE && byteBuffer[3] == 0xFF)
            {
                // Big Endian UTF32
                encoding = new UTF32Encoding(true, true);
                CompressBuffer(4);
                changedEncoding = true;
            }
            else if (byteLen == 2)
                _detectEncoding = true;
            // Note: in the future, if we change this algorithm significantly,
            // we can support checking for the preamble of the given encoding.

            if (changedEncoding)
            {
                _maxCharsPerBuffer = encoding.GetMaxCharCount(byteBuffer.Length);
                charBuffer = new char[_maxCharsPerBuffer];
            }
        }

        // Trims the preamble bytes from the byteBuffer. This routine can be called multiple times
        // and we will buffer the bytes read until the preamble is matched or we determine that
        // there is no match. If there is no match, every byte read previously will be available
        // for further consumption. If there is a match, we will compress the buffer for the
        // leading preamble bytes
        private bool IsPreamble()
        {
            return false;
        }

        internal virtual int ReadBuffer()
        {
            charLen = 0;
            charPos = 0;

            byteLen = 0;
            do
            {
                Contract.Assert(bytePos == 0, "bytePos can be non zero only when we are trying to _checkPreamble.  Are two threads using this StreamReader at the same time?");
                byteLen = stream.Read(byteBuffer, 0, byteBuffer.Length);
                Contract.Assert(byteLen >= 0, "Stream.Read returned a negative number!  This is a bug in your stream class.");

                if (byteLen == 0)  // We're at EOF
                    return charLen;

                // _isBlocked == whether we read fewer bytes than we asked for.
                // Note we must check it here because CompressBuffer or
                // DetectEncoding will change byteLen.
                _isBlocked = (byteLen < byteBuffer.Length);

                // Check for preamble before detect encoding. This is not to override the
                // user suppplied Encoding for the one we implicitly detect. The user could
                // customize the encoding which we will loose, such as ThrowOnError on UTF8
                if (IsPreamble())
                    continue;

                // If we're supposed to detect the encoding and haven't done so yet,
                // do it.  Note this may need to be called more than once.
                if (_detectEncoding && byteLen >= 2)
                    DetectEncoding();

                charLen += encoding.GetChars(byteBuffer, 0, byteLen, charBuffer, charLen);
            } while (charLen == 0);
            //Console.WriteLine("ReadBuffer called.  chars: "+charLen);
            return charLen;
        }


        // This version has a perf optimization to decode data DIRECTLY into the
        // user's buffer, bypassing StreamReader's own buffer.
        // This gives a > 20% perf improvement for our encodings across the board,
        // but only when asking for at least the number of characters that one
        // buffer's worth of bytes could produce.
        // This optimization, if run, will break SwitchEncoding, so we must not do
        // this on the first call to ReadBuffer.
        private int ReadBuffer(char[] userBuffer, int userOffset, int desiredChars, out bool readToUserBuffer)
        {
            charLen = 0;
            charPos = 0;

            byteLen = 0;

            int charsRead = 0;

            // As a perf optimization, we can decode characters DIRECTLY into a
            // user's char[].  We absolutely must not write more characters
            // into the user's buffer than they asked for.  Calculating
            // encoding.GetMaxCharCount(byteLen) each time is potentially very
            // expensive - instead, cache the number of chars a full buffer's
            // worth of data may produce.  Yes, this makes the perf optimization
            // less aggressive, in that all reads that asked for fewer than AND
            // returned fewer than _maxCharsPerBuffer chars won't get the user
            // buffer optimization.  This affects reads where the end of the
            // Stream comes in the middle somewhere, and when you ask for
            // fewer chars than your buffer could produce.
            readToUserBuffer = desiredChars >= _maxCharsPerBuffer;

            do
            {
                Contract.Assert(charsRead == 0);

                Contract.Assert(bytePos == 0, "bytePos can be non zero only when we are trying to _checkPreamble.  Are two threads using this StreamReader at the same time?");

                byteLen = stream.Read(byteBuffer, 0, byteBuffer.Length);

                Contract.Assert(byteLen >= 0, "Stream.Read returned a negative number!  This is a bug in your stream class.");

                if (byteLen == 0)  // EOF
                    break;

                // _isBlocked == whether we read fewer bytes than we asked for.
                // Note we must check it here because CompressBuffer or
                // DetectEncoding will change byteLen.
                _isBlocked = (byteLen < byteBuffer.Length);

                // Check for preamble before detect encoding. This is not to override the
                // user suppplied Encoding for the one we implicitly detect. The user could
                // customize the encoding which we will loose, such as ThrowOnError on UTF8
                // Note: we don't need to recompute readToUserBuffer optimization as IsPreamble
                // doesn't change the encoding or affect _maxCharsPerBuffer
                if (IsPreamble())
                    continue;

                // On the first call to ReadBuffer, if we're supposed to detect the encoding, do it.
                if (_detectEncoding && byteLen >= 2)
                {
                    DetectEncoding();
                    // DetectEncoding changes some buffer state.  Recompute this.
                    readToUserBuffer = desiredChars >= _maxCharsPerBuffer;
                }

                charPos = 0;
                if (readToUserBuffer)
                {
                    charsRead += encoding.GetChars(byteBuffer, 0, byteLen, userBuffer, userOffset + charsRead);
                    charLen = 0;  // StreamReader's buffer is empty.
                }
                else
                {
                    charsRead = encoding.GetChars(byteBuffer, 0, byteLen, charBuffer, charsRead);
                    charLen += charsRead;  // Number of chars in StreamReader's buffer.
                }
            } while (charsRead == 0);

            _isBlocked &= charsRead < desiredChars;

            //Console.WriteLine("ReadBuffer: charsRead: "+charsRead+"  readToUserBuffer: "+readToUserBuffer);
            return charsRead;
        }


        // Reads a line. A line is defined as a sequence of characters followed by
        // a carriage return ('\r'), a line feed ('\n'), or a carriage return
        // immediately followed by a line feed. The resulting string does not
        // contain the terminating carriage return and/or line feed. The returned
        // value is null if the end of the input stream has been reached.
        //
        public override string ReadLine()
        {
            if (stream == null)
                __Error.ReaderClosed();

            if (charPos == charLen)
            {
                if (ReadBuffer() == 0) return null;
            }

            StringBuilder sb = null;
            do
            {
                int i = charPos;
                do
                {
                    char ch = charBuffer[i];
                    // Note the following common line feed chars:
                    // \n - UNIX   \r\n - DOS   \r - Mac
                    if (ch == '\r' || ch == '\n')
                    {
                        string s;
                        if (sb != null)
                        {
                            sb.Append(new string(charBuffer, charPos, i - charPos));
                            s = sb.ToString();
                        }
                        else
                        {
                            s = new string(charBuffer, charPos, i - charPos);
                        }
                        charPos = i + 1;
                        if (ch == '\r' && (charPos < charLen || ReadBuffer() > 0))
                        {
                            if (charBuffer[charPos] == '\n') charPos++;
                        }
                        return s;
                    }
                    i++;
                } while (i < charLen);
                i = charLen - charPos;
                if (sb == null) sb = new StringBuilder(i + 80);
                sb.Append(new string(charBuffer, charPos, i));
            } while (ReadBuffer() > 0);
            return sb.ToString();
        }


        // No data, class doesn't need to be serializable.
        // Note this class is threadsafe.
        private class NullStreamReader : StreamReader
        {
            // Instantiating Encoding causes unnecessary perf hit.
            internal NullStreamReader()
            {
                Init(Stream.Null);
            }

            public override Stream BaseStream
            {
                get
                {
                    return Stream.Null;
                }
            }

            public override Encoding CurrentEncoding
            {
                get
                {
                    return Encoding.Unicode;
                }
            }

            protected override void Dispose(bool disposing)
            {
                // Do nothing - this is essentially unclosable.
            }

            public override int Peek()
            {
                return -1;
            }

            public override int Read()
            {
                return -1;
            }

            public override int Read(char[] buffer, int index, int count)
            {
                return 0;
            }

            public override string ReadLine()
            {
                return null;
            }

            public override string ReadToEnd()
            {
                return string.Empty;
            }

            internal override int ReadBuffer()
            {
                return 0;
            }

        }
    }
}
