// Copyright 2017-2022, University of Colorado Boulder

/**
 * Node for the gravity control panel and combo box for planet gravity options.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import HSlider from '../../../../sun/js/HSlider.js';
import SunConstants from '../../../../sun/js/SunConstants.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsStrings from '../../MassesAndSpringsStrings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';
import Body from '../model/Body.js';
import GravityComboBox from './GravityComboBox.js';

const dampingEqualsZeroString = MassesAndSpringsStrings.dampingEqualsZero;
const dampingString = MassesAndSpringsStrings.damping;
const gravityString = MassesAndSpringsStrings.gravity;
const gravityValueString = MassesAndSpringsStrings.gravityValue;
const lotsString = MassesAndSpringsStrings.lots;
const noneString = MassesAndSpringsStrings.none;
const whatIsTheValueOfGravityString = MassesAndSpringsStrings.whatIsTheValueOfGravity;

// constants
const SPACING = 7;
const MAX_WIDTH = 80;

class GravityAndDampingControlNode extends Node {
  /**
   * @param {MassesAndSpringsModel} model
   * @param {Node} listNodeParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   *
   */
  constructor( model, listNodeParent, tandem, options ) {
    options = merge( {
      useSliderLabels: true,
      dampingVisible: false
    }, options );

    // Manages the items associated with the gravity panel in a combo box
    const gravityComboBox = new GravityComboBox( model.bodyProperty, listNodeParent, tandem, {
      cornerRadius: 3,
      buttonYMargin: 0,
      itemYMargin: 3,
      itemXMargin: 2,
      listYMargin: 3,
      xOffset: 50,
      bodyMaxWidth: 160,
      tandem: tandem.createTandem( 'gravityComboBox' )
    } );

    const gravityProperty = model.gravityProperty;

    // Text that reads "What is the value of gravity?"
    const questionTextNode = new Node( {
      children: [ new Text( whatIsTheValueOfGravityString, {
        font: MassesAndSpringsConstants.TITLE_FONT
      } ) ]
    } );

    const gravityNumberControl = new NumberControl(
      gravityString,
      model.gravityProperty,
      MassesAndSpringsConstants.GRAVITY_RANGE, {
        xMargin: 0,
        yMargin: 0,
        includeArrowButtons: !options.useSliderLabels,
        layoutFunction: NumberControl.createLayoutFunction4( {
          sliderPadding: options.useTextSliderLabels ? 0 : 13,
          hasReadoutProperty: new DerivedProperty( [ model.bodyProperty ], body => !options.useSliderLabels && ( body !== Body.PLANET_X ) ),
          createBottomContent: bottomBox => {

            const bottomContent = new Node( {
              children: [
                questionTextNode,
                bottomBox
              ]
            } );
            questionTextNode.maxWidth = bottomBox.width * 1.25;
            questionTextNode.center = bottomBox.center;
            questionTextNode.visibleProperty.lazyLink( () => {
              bottomBox.visible = !questionTextNode.visible;
            } );
            return bottomContent;
          }
        } ),
        delta: 0.1,

        // subcomponent options
        titleNodeOptions: {
          font: new PhetFont( { size: 14, weight: 'bold' } ),
          maxWidth: MAX_WIDTH * 1.5
        },
        numberDisplayOptions: {
          valuePattern: StringUtils.fillIn( gravityValueString, {
            gravity: SunConstants.VALUE_NAMED_PLACEHOLDER
          } ),
          textOptions: {
            font: new PhetFont( { size: 14 } )
          },
          useRichText: true,
          decimalPlaces: 1,
          maxWidth: MAX_WIDTH
        },
        sliderOptions: {
          majorTickLength: 10,
          trackSize: options.useSliderLabels ? new Dimension2( 125, 0.1 ) : new Dimension2( 115, 0.1 ),
          thumbSize: new Dimension2( 13, 22 ),
          thumbFill: '#00C4DF',
          thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
          majorTicks: [
            {
              value: MassesAndSpringsConstants.GRAVITY_RANGE.min,
              label: new Text( options.useSliderLabels ? noneString : MassesAndSpringsConstants.GRAVITY_RANGE.min, {
                font: MassesAndSpringsConstants.LABEL_FONT,
                maxWidth: MAX_WIDTH
              } )
            },
            {
              value: MassesAndSpringsConstants.GRAVITY_RANGE.max,
              label: new Text( options.useSliderLabels ? lotsString : MassesAndSpringsConstants.GRAVITY_RANGE.max, {
                font: MassesAndSpringsConstants.LABEL_FONT,
                maxWidth: MAX_WIDTH
              } )
            }
          ]
        },
        arrowButtonOptions: {
          scale: 0.55,
          touchAreaXDilation: 22,
          touchAreaYDilation: 18
        }
      } );

    // Added logic for compatibility with Masses and Springs: Basics
    if ( !model.basicsVersion ) {
      if ( options.dampingVisible ) {

        // Creating title for damping hSlider
        const dampingHSliderTitle = new Text( dampingString, {
          font: new PhetFont( { size: 14, weight: 'bold' } ),
          maxWidth: MAX_WIDTH * 1.5,
          top: gravityComboBox.bottom + SPACING
        } );

        // {Range} Range for hSlider
        const dampingRange = MassesAndSpringsConstants.DAMPING_RANGE;

        // Creating damping hSlider
        const dampingHSlider = new HSlider( model.dampingProperty, dampingRange, {
          top: dampingHSliderTitle.bottom + SPACING * 3,
          left: dampingHSliderTitle.centerX,
          majorTickLength: 10,
          minorTickLength: 5,
          minorTickLineWidth: 0.5,
          trackSize: new Dimension2( 120, 0.1 ),
          thumbSize: new Dimension2( 13, 22 ),
          thumbFill: '#00C4DF',
          thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
          align: 'center',
          constrainValue: value => {
            value = Utils.roundSymmetric( value * 100 / 5.75 ) * 5.75;
            return value / 100;
          },
          tandem: tandem.createTandem( 'hSlider' )
        } );

        dampingHSlider.addMajorTick( dampingRange.min, new Text( noneString, {
          font: MassesAndSpringsConstants.LABEL_FONT,
          maxWidth: MAX_WIDTH
        } ) );
        dampingHSlider.addMajorTick( dampingRange.min + ( dampingRange.max - dampingRange.min ) / 2 );
        dampingHSlider.addMajorTick( dampingRange.max, new Text( lotsString, {
          font: MassesAndSpringsConstants.LABEL_FONT,
          maxWidth: MAX_WIDTH
        } ) );
        for ( let i = 1; i < 6; i++ ) {
          if ( i !== 3 ) {
            dampingHSlider.addMinorTick( dampingRange.min + i * ( dampingRange.max - dampingRange.min ) / 6 );
          }
        }

        const contentNode = new Node( {
          children: [
            gravityNumberControl,
            gravityComboBox,
            dampingHSliderTitle,
            dampingHSlider
          ],
          tandem: tandem.createTandem( 'gravityPropertyVBox' )
        } );

        // Content to be added to parent node
        super( { children: [ contentNode ] } );

        // Alignment of Node contents for panel with damping
        gravityNumberControl.top = this.top;
        gravityNumberControl.centerX = this.centerX;
        gravityComboBox.top = gravityNumberControl.bottom + 10;
        gravityComboBox.centerX = gravityNumberControl.centerX;
        dampingHSliderTitle.leftTop = new Vector2( gravityNumberControl.left, gravityComboBox.bottom + 10 );
        dampingHSlider.centerX = gravityNumberControl.centerX;
        dampingHSlider.top = dampingHSliderTitle.bottom + 5;
      }
      else {

        // Creating text that reads Damping = 0
        const dampingEqualsZeroText = new Text( StringUtils.fillIn( dampingEqualsZeroString, {
          equalsZero: `${MathSymbols.EQUAL_TO} 0`
        } ), {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: MAX_WIDTH * 2,
          top: gravityComboBox.bottom + SPACING,
          centerX: gravityComboBox.centerX
        } );

        // Content to be added to parent node
        const contentNode = new Node( {
          children: [
            gravityNumberControl,
            gravityComboBox,
            dampingEqualsZeroText
          ],
          tandem: tandem.createTandem( 'gravityPropertyVBox' )
        } );
        super( { children: [ contentNode ] } );

        // Alignment of Node contents for panel without damping on intro and vector screen
        gravityComboBox.centerX = gravityNumberControl.centerX;
        gravityComboBox.top = gravityNumberControl.bottom + 10;
        dampingEqualsZeroText.leftTop = new Vector2( gravityNumberControl.left, gravityComboBox.bottom + 10 );
      }
    }
    else {

      // Content to be added to parent node
      const contentNode = new Node( {
        children: [
          gravityNumberControl,
          gravityComboBox
        ],
        tandem: tandem.createTandem( 'gravityPropertyVBox' )
      } );
      super( { children: [ contentNode ] } );

      // Alignment of Node contents for panel without damping on intro and vector screen
      gravityComboBox.centerX = gravityNumberControl.centerX;
      gravityComboBox.top = gravityNumberControl.bottom + 10;
    }

    // Responsible for managing bodies. Link exists for sim duration. No need to unlink.
    model.bodyProperty.link( ( newBody, oldBody ) => {
        const body = _.find( Body.BODIES, newBody );

        // Set visibility of question node
        questionTextNode.visible = body === Body.PLANET_X;

        // If it's not custom, set it to its value
        if ( body !== Body.CUSTOM ) {
          gravityProperty.set( body.gravity );
        }
        else {
          // If we are switching from Planet X to Custom, don't let them cheat (go back to last custom value)
          if ( oldBody === Body.PLANET_X ) {
            gravityProperty.value = Body.CUSTOM.gravity;
          }

          // For non-Planet X, update our internal custom gravity
          else {
            Body.CUSTOM.gravity = gravityProperty.value;
          }
        }
      }
    );

    // change body to custom if gravity was changed by user using tweakers or slider
    model.gravityProperty.lazyLink( gravity => {

      // Checks if the new gravity value is a gravity value of a body
      if ( !_.some( Body.BODIES, body => body.gravity === gravity ) ) {
        model.bodyProperty.value = Body.CUSTOM;
      }
      if ( model.bodyProperty.value === Body.CUSTOM ) {
        Body.CUSTOM.gravity = gravity;
      }
    } );
    this.mutate( options );
  }
}

massesAndSprings.register( 'GravityAndDampingControlNode', GravityAndDampingControlNode );

export default GravityAndDampingControlNode;