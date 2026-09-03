package com.fitness.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;
import java.util.Map;

/**
 * Standardised API error response — RFC-7807 aligned.
 * Plain Java — no Lombok (avoids annotation processor Java 25 incompatibility).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    private int status;
    private String error;
    private String message;
    private Instant timestamp;
    private Map<String, String> fieldErrors;

    public ErrorResponse() {}

    private ErrorResponse(Builder b) {
        this.status = b.status;
        this.error = b.error;
        this.message = b.message;
        this.timestamp = b.timestamp;
        this.fieldErrors = b.fieldErrors;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private int status;
        private String error;
        private String message;
        private Instant timestamp;
        private Map<String, String> fieldErrors;

        public Builder status(int v)                     { this.status = v; return this; }
        public Builder error(String v)                   { this.error = v; return this; }
        public Builder message(String v)                 { this.message = v; return this; }
        public Builder timestamp(Instant v)              { this.timestamp = v; return this; }
        public Builder fieldErrors(Map<String, String> v){ this.fieldErrors = v; return this; }

        public ErrorResponse build() { return new ErrorResponse(this); }
    }

    public int getStatus()                       { return status; }
    public void setStatus(int v)                 { this.status = v; }
    public String getError()                     { return error; }
    public void setError(String v)               { this.error = v; }
    public String getMessage()                   { return message; }
    public void setMessage(String v)             { this.message = v; }
    public Instant getTimestamp()                { return timestamp; }
    public void setTimestamp(Instant v)          { this.timestamp = v; }
    public Map<String, String> getFieldErrors()  { return fieldErrors; }
    public void setFieldErrors(Map<String, String> v) { this.fieldErrors = v; }
}
