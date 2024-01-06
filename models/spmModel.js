const mongoose = require('mongoose');
const {Schema,model} = mongoose;

// TODO set arrays number (How to do?)
// TODO Add required: true 
const spmModel = new Schema({
  spm_type:Number,
  author:{type:Schema.Types.ObjectId, ref:'User', required: true}, //need to be a therapeutic
  utente:{type:Schema.Types.ObjectId, ref:'User', required: true}, //User type must be client
  evaluation_date:Date,
  question:{type: [Number], default: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
  // question_01:Number,question_02:Number,question_03:Number,question_04:Number,question_05:Number,
  // question_06:Number,question_07:Number,question_08:Number,question_09:Number,question_10:Number,
  // question_11:Number,question_12:Number,question_13:Number,question_14:Number,question_15:Number,
  // question_16:Number,question_17:Number,question_18:Number,question_19:Number,question_20:Number,
  // question_21:Number,question_22:Number,question_23:Number,question_24:Number,question_25:Number,
  // question_26:Number,question_27:Number,question_28:Number,question_29:Number,question_30:Number,
  // question_31:Number,question_32:Number,question_33:Number,question_34:Number,question_35:Number,
  // question_36:Number,question_37:Number,question_38:Number,question_39:Number,question_40:Number,
  // question_41:Number,question_42:Number,question_43:Number,question_44:Number,question_45:Number,
  // question_46:Number,question_47:Number,question_48:Number,question_49:Number,question_50:Number,
  // question_51:Number,question_52:Number,question_53:Number,question_54:Number,question_55:Number,
  // question_56:Number,question_57:Number,question_58:Number,question_59:Number,question_60:Number,
  // question_61:Number,question_62:Number,question_63:Number,question_64:Number,question_65:Number,
  evaluation_reason:String,
  group_score:{type: [Number], default: [0,0,0,0,0,0,0,0,0]},
  // group_ps_score:Number,group_v_score:Number,group_a_score:Number,group_t_score:Number,
  // group_go_score:Number,group_cc_score:Number,group_me_score:Number,group_pmi_score:Number,
  // group_total_score:Number,
  group_tsocre:{type: [Number], default: [0,0,0,0,0,0,0,0,0]},
  // group_ps_tscore:Number,group_v_tscore:Number,group_a_tscore:Number,group_t_tscore:Number,
  // group_go_tscore:Number,group_cc_tscore:Number,group_me_tscore:Number,group_pmi_tscore:Number,
  // group_total_tscore:Number,
  group_comment:{type: [Number], default: [0,0,0,0,0,0,0,0,0]},
  // group_ps_comment:Number,group_v_comment:Number,group_a_comment:Number,group_t_comment:Number,
  // group_go_comment:Number,group_cc_comment:Number,group_me_comment:Number,group_pmi_comment:Number,
  // group_total_comment:Number,
}, {
  timestamps: true,
});

const SpmModel = model('SPM', spmModel);

module.exports = SpmModel;