class Stage < ActiveRecord::Base
  include ProtocolHelper
  include ProtocolOrderHelper
  
  belongs_to :protocol
  has_many :steps, -> {order("order_number")}
  has_many :ramps, :through => :steps
  
  scope :collect_data, -> { joins(:steps, :protocol).joins("LEFT OUTER JOIN ramps ON ramps.next_step_id = steps.id").where("stage_type ='#{TYPE_CYCLE}' AND (steps.collect_data=true OR ramps.collect_data=true)").order("stages.order_number")}
  
  validate :validate
  
  TYPE_HOLD   = "holding"
  TYPE_CYCLE  = "cycling"
  TYPE_MELTCURVE = "meltcurve"
  
  ACCESSIBLE_ATTRS = [:name, :num_cycles, :stage_type, :auto_delta, :auto_delta_start_cycle]
  
  before_create do |stage|
    if num_cycles.nil? && cycle_stage?
      self.num_cycles = 40
    elsif hold_stage? || num_cycles.nil?
      self.num_cycles = 1
    end
  end
  
  after_create do |stage|
    if steps.count == 0
      if hold_stage?
        if !prev_id.nil?
          reference_stage = Stage.find_by_id(prev_id)
        end
        if reference_stage.nil?
          reference_stage = siblings.first
        end
        if reference_stage
          reference_step = reference_stage.steps.last
        end
        if reference_step
          stage.steps << Step.new(:temperature=>reference_step.temperature, :hold_time=>reference_step.hold_time, :order_number=>0)
        else
          stage.steps << Step.new(:temperature=>95, :hold_time=>30, :order_number=>0)
        end
      elsif cycle_stage?
        stage.steps << Step.new(:temperature=>95, :hold_time=>30, :order_number=>0)
        stage.steps << Step.new(:temperature=>60, :hold_time=>30, :order_number=>1)
      elsif meltcurve_stage?
        stage.steps << Step.new(:temperature=>90, :hold_time=>30, :order_number=>0)
        stage.steps << Step.new(:temperature=>60, :hold_time=>60, :order_number=>1)
        step = Step.new(:temperature=>95, :hold_time=>30, :order_number=>2)
        step.ramp = Ramp.new(:rate=>0.09, :collect_data=>true)
        stage.steps << step
      end
    end
  end
  
  before_destroy do |stage|
    if stage.destroyed?
      return false
    elsif stage.protocol && stage.protocol.stages.count <= 1
      errors.add(:base, "At least one stage is required")
      return false
    end
  end
  
  #delete steps after stage destroy, so that step.stage will be nil
  after_destroy do |stage|
    for step in stage.steps
      step.destroy
    end
  end
  
  def name
    name_attr = read_attribute(:name)
    if name_attr.nil?
      if hold_stage?
        return "Holding Stage"
      elsif cycle_stage?
        return "Cycling Stage"
      elsif meltcurve_stage?
        return "Melt Curve Stage"
      end
    else
      return name_attr
    end
  end
  
  def hold_stage?
    stage_type == TYPE_HOLD
  end
  
  def cycle_stage?
    stage_type == TYPE_CYCLE
  end
  
  def meltcurve_stage?
    stage_type == TYPE_MELTCURVE
  end

  def copy
    new_stage = copy_helper
    steps.each do |step|
      new_stage.steps << step.copy
    end
    new_stage
  end
  
  def new_sibling?
    new_record?
  end
  
  def siblings
    if protocol.nil?
      nil
    elsif !id.nil?
      protocol.stages.where("id != ?", id)
    else
      protocol.stages
    end
  end
  
  def last_stage?
    !self.class.where("protocol_id = ? and order_number > ?", protocol_id, order_number).exists?
  end
  
  protected

  def validate
    if auto_delta
      if !cycle_stage?
        errors.add(:auto_delta, "only allowed for cycling stage")
      elsif auto_delta_start_cycle == 0 || auto_delta_start_cycle > num_cycles
        errors.add(:auto_delta_start_cycle, "Cannot be greater than the total number of cycles")
      end
    end
    
    if new_record?
      if !prev_id.nil?
        step = Step.where(:stage_id=>prev_id).order(order_number: :desc).first
        if step && step.infinite_hold?
          errors.add(:base, "Cannot add stage after infinite hold step")
        end
      end
    end
  end
end

