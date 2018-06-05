// Copyright 2018, University of Colorado Boulder

/**
 * View for period trace of mass oscillation.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var X_OFFSET = 10;
  var FADE_OUT_SPEED = 1; // the speed at which the trace fades out.

  /**
   * @param {PeriodTrace} periodTrace
   * @param {ModelViewTransform2} modelViewTransform
   *
   * @constructor
   */
  function PeriodTraceNode( periodTrace, modelViewTransform ) {
    Node.call( this );
    var self = this;

    // @public {PeriodTrace} Model element for the period trace.
    this.periodTrace = periodTrace;

    // @private {number} The opacity of the trace (not using Node opacity for performance reasons)
    this.colorAlpha = 1;

    // @private
    this.traceColor = new Color( 'black' );

    // @private
    this.modelViewTransform = modelViewTransform;

    this.originalX = this.modelViewTransform.modelToViewX( this.periodTrace.spring.positionProperty.value.x - 0.2 );
    this.middleX = this.originalX + X_OFFSET;
    this.lastX = this.originalX + 2 * X_OFFSET;

    this.path = new Path( null, { stroke: this.traceColor, lineWidth: 2.5 } );
    this.addChild( this.path );
    this.periodTrace.stateProperty.link( function( state ) {
      if ( state === 1 ) {
        self.traceColor.alpha = 1;
        self.colorAlpha = 1;
      }
    } );
  }

  massesAndSprings.register( 'PeriodTraceNode', PeriodTraceNode );

  return inherit( Node, PeriodTraceNode, {

    /**
     * @param {number} dt
     * @param {Property.<boolean>} playingProperty: whether the sim is playing or not
     */
    step: function( dt, playingProperty ) {
      var spring = this.periodTrace.spring;
      var mass = spring.massAttachedProperty.value;

      // The period trace should only be drawn when a mass is oscillating on a spring and its checkbox is toggled on.
      if ( mass && !mass.userControlledProperty.value &&
           spring.periodTraceVisibilityProperty.value &&
           !(mass.verticalVelocityProperty.value === 0) ) {

        // Responsible for fading the period trace.We want to fade only when the sim is playing and
        // the state is either 4 or when the trace has begun fading already.
        if ( (this.periodTrace.stateProperty.value === 4 || this.colorAlpha !== 1) && playingProperty.value ) {
          this.fade( dt );
        }

        // Responsible for drawing the period trace based on the state of the trace.
        var modelViewTransform = this.modelViewTransform;
        if ( mass && !mass.userControlledProperty.value ) {

          // Transforming our model positions into view positions.
          var massEquilibrium = spring.massEquilibriumYPositionProperty.value;
          var equilibriumYPosition = modelViewTransform.modelToViewY( massEquilibrium );
          var firstPeakYPosition = modelViewTransform.modelToViewY( massEquilibrium + this.periodTrace.firstPeakY );
          var secondPeakYPosition = modelViewTransform.modelToViewY( massEquilibrium + this.periodTrace.secondPeakY );
          var currentYPosition = modelViewTransform.modelToViewY( massEquilibrium +
                                                                  spring.massEquilibriumDisplacementProperty.value );

          this.shape = new Shape();

          var state = this.periodTrace.stateProperty.value; // 0 to 4
          if ( state === 0 ) {
            this.visible = false && spring.periodTraceVisibilityProperty.value;
          }
          else {
            this.visible = spring.periodTraceVisibilityProperty.value;

            // sets our initial position
            this.shape.moveTo( this.originalX, equilibriumYPosition );

            // draws a line from our current position to a NEW position, then sets our current position to the NEW position
            this.shape.verticalLineTo( state === 1 ? currentYPosition : firstPeakYPosition );
            if ( state > 1 ) {

              // first connector
              this.shape.horizontalLineTo( this.middleX );

              // second line
              this.shape.verticalLineTo( state === 2 ? currentYPosition : secondPeakYPosition + this.path.lineWidth / 2 );
              if ( state > 2 ) {

                // second connector
                this.shape.horizontalLineTo( this.lastX );

                // third line
                this.shape.verticalLineTo( state === 3 ? currentYPosition : equilibriumYPosition - this.path.lineWidth / 2 );
              }
            }
            this.path.lineWidth = this.periodTrace.thresholdReached ? 0.5 : 2.5;
            this.path.setShape( this.shape );
          }
        }
      }

      // Responsible for restarting the period trace.
      else {
        this.visible = false && spring.periodTraceVisibilityProperty.value;
        this.periodTrace.onFaded();
      }
    },
    /**
     * Fades the period trace.
     * @param dt
     *
     * @private
     */
    fade: function( dt ) {
      this.colorAlpha = Math.max( 0, this.colorAlpha - FADE_OUT_SPEED * dt );
      this.traceColor.alpha = this.colorAlpha;

      if ( this.colorAlpha === 0 ) {
        this.periodTrace.onFaded();
        this.traceColor.alpha = 1;
        this.colorAlpha = 1;
      }
    }
  } );
} );