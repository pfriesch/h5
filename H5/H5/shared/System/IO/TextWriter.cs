// ==++==
//
//   Copyright (c) Microsoft Corporation.  All rights reserved.
//
// ==--==
/*============================================================
**
** Class:  TextWriter
**
** <OWNER>Microsoft</OWNER>
**
**
** Purpose: Abstract base class for Text-only Writers.
** Subclasses will include StreamWriter & StringWriter.
**
**
===========================================================*/
/*
 * https://github.com/Microsoft/referencesource/blob/master/mscorlib/system/io/textwriter.cs
 */

using System;
using System.Text;
using System.Threading;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Reflection;
using System.Security.Permissions;
using System.Globalization;
using System.Diagnostics.CodeAnalysis;
using System.Diagnostics.Contracts;

namespace System.IO
{
    // This abstract base class represents a writer that can write a sequential
    // stream of characters. A subclass must minimally implement the
    // Write(char) method.
    //
    // This class is intended for character output, not bytes.
    // There are methods on the Stream class for writing bytes.
    public abstract class TextWriter : IDisposable
    {
        public static readonly TextWriter Null = new NullTextWriter();

        // This should be initialized to Environment.NewLine, but
        // to avoid loading Environment unnecessarily so I've duplicated
        // the value here.
        private const string InitialNewLine = "\r\n";

        protected char[] CoreNewLine = new char[] { '\r', '\n' };

        // Can be null - if so, ask for the Thread's CurrentCulture every time.
        private IFormatProvider InternalFormatProvider;

        protected TextWriter()
        {
            InternalFormatProvider = null;  // Ask for CurrentCulture all the time.
        }

        protected TextWriter(IFormatProvider formatProvider)
        {
            InternalFormatProvider = formatProvider;
        }

        public virtual IFormatProvider FormatProvider
        {
            get
            {
                if (InternalFormatProvider == null)
                    return CultureInfo.CurrentCulture;
                else
                    return InternalFormatProvider;
            }
        }

        // Closes this TextWriter and releases any system resources associated with the
        // TextWriter. Following a call to Close, any operations on the TextWriter
        // may raise exceptions. This default method is empty, but descendant
        // classes can override the method to provide the appropriate
        // functionality.
        public virtual void Close()
        {
            Dispose(true);
        }

        protected virtual void Dispose(bool disposing)
        {
        }


        public void Dispose()
        {
            Dispose(true);
        }

        // Clears all buffers for this TextWriter and causes any buffered data to be
        // written to the underlying device. This default method is empty, but
        // descendant classes can override the method to provide the appropriate
        // functionality.
        public virtual void Flush()
        {
        }

        public abstract Encoding Encoding
        {
            get;
        }

        // Returns the line terminator string used by this TextWriter. The default line
        // terminator string is a carriage return followed by a line feed ("\r\n").
        //
        // Sets the line terminator string for this TextWriter. The line terminator
        // string is written to the text stream whenever one of the
        // WriteLine methods are called. In order for text written by
        // the TextWriter to be readable by a TextReader, only one of the following line
        // terminator strings should be used: "\r", "\n", or "\r\n".
        //
        public virtual string NewLine
        {
            get
            {
                return new string(CoreNewLine);
            }
            set
            {
                if (value == null)
                    value = InitialNewLine;
                CoreNewLine = value.ToCharArray();
            }
        }


        [HostProtection(Synchronization = true)]
        public static TextWriter Synchronized(TextWriter writer)
        {
            if (writer == null)
                throw new ArgumentNullException("writer");
            Contract.Ensures(Contract.Result<TextWriter>() != null);
            Contract.EndContractBlock();

            return writer;
        }

        // Writes a character to the text stream. This default method is empty,
        // but descendant classes can override the method to provide the
        // appropriate functionality.
        //
        public virtual void Write(char value)
        {
        }

        // Writes a character array to the text stream. This default method calls
        // Write(char) for each of the characters in the character array.
        // If the character array is null, nothing is written.
        //
        public virtual void Write(char[] buffer)
        {
            if (buffer != null) Write(buffer, 0, buffer.Length);
        }

        // Writes a range of a character array to the text stream. This method will
        // write count characters of data into this TextWriter from the
        // buffer character array starting at position index.
        //
        public virtual void Write(char[] buffer, int index, int count)
        {
            if (buffer == null)
                throw new ArgumentNullException("buffer");
            if (index < 0)
                throw new ArgumentOutOfRangeException("index");
            if (count < 0)
                throw new ArgumentOutOfRangeException("count");
            if (buffer.Length - index < count)
                throw new ArgumentException();
            Contract.EndContractBlock();

            for (int i = 0; i < count; i++) Write(buffer[index + i]);
        }

        // Writes the text representation of a boolean to the text stream. This
        // method outputs either Boolean.TrueString or Boolean.FalseString.
        //
        public virtual void Write(bool value)
        {
            Write(value ? bool.TrueString : bool.FalseString);
        }

        // Writes the text representation of an integer to the text stream. The
        // text representation of the given value is produced by calling the
        // Int32.ToString() method.
        //
        public virtual void Write(int value)
        {
            Write(value.ToString("G", FormatProvider));
        }

        // Writes the text representation of an integer to the text stream. The
        // text representation of the given value is produced by calling the
        // UInt32.ToString() method.
        //
        
        public virtual void Write(uint value)
        {
            Write(value.ToString("G", FormatProvider));
        }

        // Writes the text representation of a long to the text stream. The
        // text representation of the given value is produced by calling the
        // Int64.ToString() method.
        //
        public virtual void Write(long value)
        {
            Write(value.ToString("G", FormatProvider));
        }

        // Writes the text representation of an unsigned long to the text
        // stream. The text representation of the given value is produced
        // by calling the UInt64.ToString() method.
        //
        
        public virtual void Write(ulong value)
        {
            Write(value.ToString("G", FormatProvider));
        }

        // Writes the text representation of a float to the text stream. The
        // text representation of the given value is produced by calling the
        // Float.toString(float) method.
        //
        public virtual void Write(float value)
        {
            Write(value.ToString(FormatProvider));
        }

        // Writes the text representation of a double to the text stream. The
        // text representation of the given value is produced by calling the
        // Double.toString(double) method.
        //
        public virtual void Write(double value)
        {
            Write(value.ToString(FormatProvider));
        }

        public virtual void Write(decimal value)
        {
            Write(value.ToString(FormatProvider));
        }

        // Writes a string to the text stream. If the given string is null, nothing
        // is written to the text stream.
        //
        public virtual void Write(string value)
        {
            if (value != null) Write(value.ToCharArray());
        }

        // Writes the text representation of an object to the text stream. If the
        // given object is null, nothing is written to the text stream.
        // Otherwise, the object's ToString method is called to produce the
        // string representation, and the resulting string is then written to the
        // output stream.
        //
        public virtual void Write(object value)
        {
            if (value != null)
            {
                if (value is IFormattable f)
                    Write(f.ToString(null, FormatProvider));
                else
                    Write(value.ToString());
            }
        }


        // Writes out a formatted string.  Uses the same semantics as
        // String.Format.
        //
        public virtual void Write(string format, object arg0)
        {
            Write(string.Format(FormatProvider, format, arg0));
        }

        // Writes out a formatted string.  Uses the same semantics as
        // String.Format.
        //
        public virtual void Write(string format, object arg0, object arg1)
        {
            Write(string.Format(FormatProvider, format, arg0, arg1));
        }

        // Writes out a formatted string.  Uses the same semantics as
        // String.Format.
        //
        public virtual void Write(string format, object arg0, object arg1, object arg2)
        {
            Write(string.Format(FormatProvider, format, arg0, arg1, arg2));
        }

        // Writes out a formatted string.  Uses the same semantics as
        // String.Format.
        //
        public virtual void Write(string format, params object[] arg)
        {
            Write(string.Format(FormatProvider, format, arg));
        }


        // Writes a line terminator to the text stream. The default line terminator
        // is a carriage return followed by a line feed ("\r\n"), but this value
        // can be changed by setting the NewLine property.
        //
        public virtual void WriteLine()
        {
            Write(CoreNewLine);
        }

        // Writes a character followed by a line terminator to the text stream.
        //
        public virtual void WriteLine(char value)
        {
            Write(value);
            WriteLine();
        }

        // Writes an array of characters followed by a line terminator to the text
        // stream.
        //
        public virtual void WriteLine(char[] buffer)
        {
            Write(buffer);
            WriteLine();
        }

        // Writes a range of a character array followed by a line terminator to the
        // text stream.
        //
        public virtual void WriteLine(char[] buffer, int index, int count)
        {
            Write(buffer, index, count);
            WriteLine();
        }

        // Writes the text representation of a boolean followed by a line
        // terminator to the text stream.
        //
        public virtual void WriteLine(bool value)
        {
            Write(value);
            WriteLine();
        }

        // Writes the text representation of an integer followed by a line
        // terminator to the text stream.
        //
        public virtual void WriteLine(int value)
        {
            Write(value);
            WriteLine();
        }

        // Writes the text representation of an unsigned integer followed by
        // a line terminator to the text stream.
        //
        
        public virtual void WriteLine(uint value)
        {
            Write(value);
            WriteLine();
        }

        // Writes the text representation of a long followed by a line terminator
        // to the text stream.
        //
        public virtual void WriteLine(long value)
        {
            Write(value);
            WriteLine();
        }

        // Writes the text representation of an unsigned long followed by
        // a line terminator to the text stream.
        //
        
        public virtual void WriteLine(ulong value)
        {
            Write(value);
            WriteLine();
        }

        // Writes the text representation of a float followed by a line terminator
        // to the text stream.
        //
        public virtual void WriteLine(float value)
        {
            Write(value);
            WriteLine();
        }

        // Writes the text representation of a double followed by a line terminator
        // to the text stream.
        //
        public virtual void WriteLine(double value)
        {
            Write(value);
            WriteLine();
        }

        public virtual void WriteLine(decimal value)
        {
            Write(value);
            WriteLine();
        }

        // Writes a string followed by a line terminator to the text stream.
        //
        public virtual void WriteLine(string value)
        {

            if (value == null)
            {
                WriteLine();
            }
            else
            {
                // We'd ideally like WriteLine to be atomic, in that one call
                // to WriteLine equals one call to the OS (ie, so writing to
                // console while simultaneously calling printf will guarantee we
                // write out a string and new line chars, without any interference).
                // Additionally, we need to call ToCharArray on Strings anyways,
                // so allocating a char[] here isn't any worse than what we were
                // doing anyways.  We do reduce the number of calls to the
                // backing store this way, potentially.
                int vLen = value.Length;
                int nlLen = CoreNewLine.Length;
                char[] chars = new char[vLen + nlLen];
                value.CopyTo(0, chars, 0, vLen);
                // CoreNewLine will almost always be 2 chars, and possibly 1.
                if (nlLen == 2)
                {
                    chars[vLen] = CoreNewLine[0];
                    chars[vLen + 1] = CoreNewLine[1];
                }
                else if (nlLen == 1)
                    chars[vLen] = CoreNewLine[0];
                else
                    Array.Copy(CoreNewLine, 0, chars, vLen * 2, nlLen * 2);
                Write(chars, 0, vLen + nlLen);
            }
            /*
            Write(value);  // We could call Write(String) on StreamWriter...
            WriteLine();
            */
        }

        // Writes the text representation of an object followed by a line
        // terminator to the text stream.
        //
        public virtual void WriteLine(object value)
        {
            if (value == null)
            {
                WriteLine();
            }
            else
            {
                // Call WriteLine(value.ToString), not Write(Object), WriteLine().
                // This makes calls to WriteLine(Object) atomic.
                if (value is IFormattable f)
                    WriteLine(f.ToString(null, FormatProvider));
                else
                    WriteLine(value.ToString());
            }
        }

        // Writes out a formatted string and a new line.  Uses the same
        // semantics as String.Format.
        //
        public virtual void WriteLine(string format, object arg0)
        {
            WriteLine(string.Format(FormatProvider, format, arg0));
        }

        // Writes out a formatted string and a new line.  Uses the same
        // semantics as String.Format.
        //
        public virtual void WriteLine(string format, object arg0, object arg1)
        {
            WriteLine(string.Format(FormatProvider, format, arg0, arg1));
        }

        // Writes out a formatted string and a new line.  Uses the same
        // semantics as String.Format.
        //
        public virtual void WriteLine(string format, object arg0, object arg1, object arg2)
        {
            WriteLine(string.Format(FormatProvider, format, arg0, arg1, arg2));
        }

        // Writes out a formatted string and a new line.  Uses the same
        // semantics as String.Format.
        //
        public virtual void WriteLine(string format, params object[] arg)
        {
            WriteLine(string.Format(FormatProvider, format, arg));
        }

#if FEATURE_ASYNC_IO
        #region Task based Async APIs
        [HostProtection(ExternalThreading = true)]
        [ComVisible(false)]
        public virtual Task WriteAsync(char value)
        {
            Tuple<TextWriter, char> tuple = new Tuple<TextWriter, char>(this, value);
            return Task.Factory.StartNew(_WriteCharDelegate, tuple, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }

        [HostProtection(ExternalThreading = true)]
        [ComVisible(false)]
        public virtual Task WriteAsync(String value)
        {
            Tuple<TextWriter, string> tuple = new Tuple<TextWriter, string>(this, value);
            return Task.Factory.StartNew(_WriteStringDelegate, tuple, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }

        [HostProtection(ExternalThreading = true)]
        [ComVisible(false)]
        public Task WriteAsync(char[] buffer)
        {
            if (buffer == null)  return Task.CompletedTask;
            return WriteAsync(buffer, 0, buffer.Length);
        }

        [HostProtection(ExternalThreading = true)]
        [ComVisible(false)]
        public virtual Task WriteAsync(char[] buffer, int index, int count)
        {
            Tuple<TextWriter, char[], int, int> tuple = new Tuple<TextWriter, char[], int, int>(this, buffer, index, count);
            return Task.Factory.StartNew(_WriteCharArrayRangeDelegate, tuple, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }

        [HostProtection(ExternalThreading = true)]
        [ComVisible(false)]
        public virtual Task WriteLineAsync(char value)
        {
            Tuple<TextWriter, char> tuple = new Tuple<TextWriter, char>(this, value);
            return Task.Factory.StartNew(_WriteLineCharDelegate, tuple, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }

        [HostProtection(ExternalThreading = true)]
        [ComVisible(false)]
        public virtual Task WriteLineAsync(String value)
        {
            Tuple<TextWriter, string> tuple = new Tuple<TextWriter, string>(this, value);
            return Task.Factory.StartNew(_WriteLineStringDelegate, tuple, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }

        [HostProtection(ExternalThreading = true)]
        [ComVisible(false)]
        public Task WriteLineAsync(char[] buffer)
        {
            if (buffer == null)  return Task.CompletedTask;
            return WriteLineAsync(buffer, 0, buffer.Length);
        }

        [HostProtection(ExternalThreading = true)]
        [ComVisible(false)]
        public virtual Task WriteLineAsync(char[] buffer, int index, int count)
        {
            Tuple<TextWriter, char[], int, int> tuple = new Tuple<TextWriter, char[], int, int>(this, buffer, index, count);
            return Task.Factory.StartNew(_WriteLineCharArrayRangeDelegate, tuple, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }

        [HostProtection(ExternalThreading = true)]
        [ComVisible(false)]
        public virtual Task WriteLineAsync()
        {
            return WriteAsync(CoreNewLine);
        }

        [HostProtection(ExternalThreading = true)]
        [ComVisible(false)]
        public virtual Task FlushAsync()
        {
            return Task.Factory.StartNew(_FlushDelegate, this, CancellationToken.None, TaskCreationOptions.DenyChildAttach, TaskScheduler.Default);
        }
        #endregion
#endif //FEATURE_ASYNC_IO

        [Serializable]
        private sealed class NullTextWriter : TextWriter
        {
            internal NullTextWriter() : base(CultureInfo.InvariantCulture)
            {
            }

            public override Encoding Encoding
            {
                get
                {
                    return Encoding.Default;
                }
            }

            [SuppressMessage("Microsoft.Contracts", "CC1055")]  // Skip extra error checking to avoid *potential* AppCompat problems.
            public override void Write(char[] buffer, int index, int count)
            {
            }

            public override void Write(string value)
            {
            }

            // Not strictly necessary, but for perf reasons
            public override void WriteLine()
            {
            }

            // Not strictly necessary, but for perf reasons
            public override void WriteLine(string value)
            {
            }

            public override void WriteLine(object value)
            {
            }
        }
    }
}
