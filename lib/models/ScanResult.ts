// lib/models/ScanResult.ts
import mongoose, { Schema, Document, Model } from 'mongoose'
import { TrustLevel } from '../types'

export interface IScanResult extends Document {
  userId: string
  url: string
  score: number
  trustLevel: TrustLevel
  scanDate: Date
  apiResults: {
    googleSafeBrowsing?: any
    virusTotal?: any
  }
}

const ScanResultSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  url: { type: String, required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  trustLevel: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E', 'F'],
  },
  scanDate: { type: Date, default: Date.now },

  apiResults: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },
})

const ScanResult: Model<IScanResult> =
  (mongoose.models.ScanResult as Model<IScanResult>) ||
  mongoose.model<IScanResult>('ScanResult', ScanResultSchema)

export default ScanResult
