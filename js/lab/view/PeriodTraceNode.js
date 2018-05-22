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

    this.originalX = this.modelViewTransform.modelToViewX( this.periodTrace.springProperty.value.positionProperty.value.x - 0.2 );
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
     *
     * @param {number} dt
     * @param {Property.<boolean>} playingProperty: whether the sim is playing or not
     */
    step: function( dt, playingProperty ) {
      var spring = this.periodTrace.springProperty.value;
      if ( spring.periodTraceVisibilityProperty.value ) {
        if ( this.periodTrace.stateProperty.value === 4 && playingProperty.value ) {
          this.colorAlpha = Math.max( 0, this.colorAlpha - FADE_OUT_SPEED * dt );
          this.traceColor.alpha = this.colorAlpha;

          if ( this.colorAlpha === 0 ) {
            this.periodTrace.onFaded();
            this.traceColor.alpha = 1;
            this.colorAlpha = 1;
          }
        }

        var modelViewTransform = this.modelViewTransform;
        var mass = spring.massAttachedProperty.value;
        if ( mass && !mass.userControlledProperty.value ) {

          var equilibriumYPosition = modelViewTransform.modelToViewY( spring.massEquilibriumYPositionProperty.value );
          var firstPeakYPosition = modelViewTransform.modelToViewY( spring.massEquilibriumYPositionProperty.value + this.periodTrace.firstPeakY );
          var secondPeakYPosition = modelViewTransform.modelToViewY( spring.massEquilibriumYPositionProperty.value + this.periodTrace.secondPeakY );
          var currentYPosition = modelViewTransform.modelToViewY( spring.massEquilibriumYPositionProperty.value + spring.massEquilibriumDisplacementProperty.value );

          var state = this.periodTrace.stateProperty.value; // 0 to 4
          if ( state === 0 ) {
            this.visible = false && spring.periodTraceVisibilityProperty.value;
          }
          else {
            this.visible = spring.periodTraceVisibilityProperty.value;
            var shape = new Shape();
            shape.moveTo( this.originalX, equilibriumYPosition ); // sets our current position

            // draws a line from our current position to a NEW position, then sets our current position to the NEW position
            shape.lineTo( this.originalX, state === 1 ? currentYPosition : firstPeakYPosition );

            if ( state > 1 ) {

              // first connector
              shape.lineTo( this.middleX, firstPeakYPosition );

              // second line
              shape.lineTo( this.middleX, state === 2 ? currentYPosition : secondPeakYPosition );
              if ( state > 2 ) {

                // second connector
                shape.lineTo( this.lastX, secondPeakYPosition );

                // third line
                shape.lineTo( this.lastX, state === 3 ? currentYPosition : equilibriumYPosition );
              }
            }
            this.path.shape = shape;
          }
        }
      }
      else {
        this.visible = false && spring.periodTraceVisibilityProperty.value;
        this.periodTrace.stateProperty.reset();
        this.periodTrace.crossingProperty.reset();
      }
    }
  } );
} );