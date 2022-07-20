// Copyright 2018-2022, University of Colorado Boulder

/**
 * View for period trace of mass oscillation.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color, Node, Path } from '../../../../scenery/js/imports.js';
import massesAndSprings from '../../massesAndSprings.js';

// constants
const X_OFFSET = 10;
const FADE_OUT_SPEED = 1; // the speed at which the trace fades out.

class PeriodTraceNode extends Node {
  /**
   * @param {PeriodTrace} periodTrace
   * @param {ModelViewTransform2} modelViewTransform
   *
   */
  constructor( periodTrace, modelViewTransform ) {
    super();

    // @public {PeriodTrace} Model element for the period trace
    this.periodTrace = periodTrace;

    // @public {Shape}
    this.shape = new Shape();

    // @private {number} The opacity of the trace (not using Node opacity for performance reasons)
    this.colorAlpha = 1;

    // @private {Property.<Color>}
    this.traceColorProperty = new Property( new Color( 'black' ) );

    // @private {ModelViewTransForm}
    this.modelViewTransform = modelViewTransform;

    this.originalX = this.modelViewTransform.modelToViewX( periodTrace.spring.positionProperty.value.x - 0.2 );
    this.middleX = this.originalX + X_OFFSET;
    this.lastX = this.originalX + 2 * X_OFFSET;

    this.path = new Path( null, { stroke: this.traceColorProperty, lineWidth: 2.5 } );
    this.addChild( this.path );
    this.periodTrace.stateProperty.link( state => {
      if ( state === 1 ) {
        this.traceColorProperty.value = this.traceColorProperty.value.withAlpha( 1 );
        this.colorAlpha = 1;
      }
    } );
  }


  /**
   * @param {number} dt
   * @param {Property.<boolean>} playingProperty: whether the sim is playing or not
   * @public
   */
  step( dt, playingProperty ) {
    const spring = this.periodTrace.spring;
    const mass = spring.massAttachedProperty.value;

    // The period trace should only be drawn when a mass is oscillating on a spring and its checkbox is toggled on.
    if ( mass && !mass.userControlledProperty.value &&
         spring.periodTraceVisibilityProperty.value &&
         !( mass.verticalVelocityProperty.value === 0 ) ) {

      // Responsible for fading the period trace.We want to fade only when the sim is playing and
      // the state is either 4 or when the trace has begun fading already.
      if ( ( this.periodTrace.stateProperty.value === 4 || this.colorAlpha !== 1 ) && playingProperty.value ) {
        this.fade( dt );
      }

      // Responsible for drawing the period trace based on the state of the trace.
      const modelViewTransform = this.modelViewTransform;
      if ( mass && !mass.userControlledProperty.value ) {

        // Transforming our model positions into view positions.
        const massEquilibrium = spring.massEquilibriumYPositionProperty.value;
        const equilibriumYPosition = modelViewTransform.modelToViewY( massEquilibrium );
        const firstPeakYPosition = modelViewTransform.modelToViewY( massEquilibrium + this.periodTrace.firstPeakY );
        const secondPeakYPosition = modelViewTransform.modelToViewY( massEquilibrium + this.periodTrace.secondPeakY );
        const currentYPosition = modelViewTransform.modelToViewY( massEquilibrium +
                                                                  spring.massEquilibriumDisplacementProperty.value );

        this.shape = new Shape();

        const state = this.periodTrace.stateProperty.value; // 0 to 4
        if ( state === 0 ) {
          this.visible = false;
        }
        else {
          this.visible = spring.periodTraceVisibilityProperty.value;

          // sets our initial position
          this.shape.moveTo( this.originalX, equilibriumYPosition );

          // draws a line from our current position to a new position, then sets our current position to the new position
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

          // Thin the line width once it reaches a certain threshold at a rate of delta.
          // Variables are extracted for readability.
          const delta = 0.025;          // Rate at which the line is being thinned. Empirically determined.
          const maxLineWidth = 2.5;     // Maximum line width of the trace.
          const minLineWidth = 0.5;     // Minimum line width of the trace.

          this.path.lineWidth = this.periodTrace.thresholdReached ? ( this.path.lineWidth - delta ) : maxLineWidth;
          if ( this.path.lineWidth <= minLineWidth ) {
            this.path.lineWidth = minLineWidth;
          }
          this.path.setShape( this.shape );
        }
      }
    }

    // Responsible for restarting the period trace.
    else {
      this.visible = false;
      this.periodTrace.onFaded();
    }
  }

  /**
   * Fades the period trace.
   * @param {number} dt
   *
   * @private
   */
  fade( dt ) {
    this.colorAlpha = Math.max( 0, this.colorAlpha - FADE_OUT_SPEED * dt );
    this.traceColorProperty.value = this.traceColorProperty.value.withAlpha( this.colorAlpha );

    if ( this.colorAlpha === 0 ) {
      this.periodTrace.onFaded();
      this.traceColorProperty.value = this.traceColorProperty.value.withAlpha( 1 );
      this.colorAlpha = 1;
    }
  }
}

massesAndSprings.register( 'PeriodTraceNode', PeriodTraceNode );

export default PeriodTraceNode;